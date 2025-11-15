
import { GoogleGenAI, Type } from '@google/genai';

// --- START of necessary types (copied from types.ts) ---
// This makes the serverless function self-contained.
enum BantStage {
  BUDGET = 'BUDGET',
  AUTHORITY = 'AUTHORITY',
  NEED = 'NEED',
  TIMELINE = 'TIMELINE',
  COMPLETED = 'COMPLETED',
}

interface LeadDetails {
  name: string;
  company: string;
  email: string;
  service: string;
}

interface Vendor {
  name:string;
  logoUrl: string;
  heroImageUrl: string;
  description: string;
  specialties: string[];
  pricingTier: 'SMB' | 'Enterprise' | 'Flexible';
}

interface Service {
  name: string;
  description: string;
  icon: string;
  detailedDescription: string;
  keyBenefits: string[];
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

type ListingCategory = 'Software' | 'Hardware' | 'Service';
type ListingStatus = 'Pending Validation' | 'Validated' | 'Assigned';

interface RequirementListing {
  id: number;
  title: string;
  description: string;
  category: ListingCategory;
  authorName: string;
  companyName: string;
  postedDate: string; // ISO string
}
// --- END of necessary types ---


let aiInstance: GoogleGenAI | null = null;
const getAI = () => {
  if (!aiInstance) {
    if (!process.env.API_KEY) {
      throw new Error("API Key not found in server environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

// Schemas for structured JSON responses from Gemini
const bantResponseSchema = {
  type: Type.OBJECT,
  properties: {
    analysis: { type: Type.STRING },
    extractedData: { type: Type.STRING },
    isStageComplete: { type: Type.BOOLEAN },
    nextQuestion: { type: Type.STRING },
  },
  required: ['analysis', 'extractedData', 'isStageComplete', 'nextQuestion'],
};

const solutionFinderSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING },
        suggestedService: { type: Type.STRING },
        suggestedVendors: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["summary", "suggestedService", "suggestedVendors"],
};

const vendorMatchingSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      vendorName: { type: Type.STRING },
      justification: { type: Type.STRING }
    },
    required: ["vendorName", "justification"]
  }
};


export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const ai = getAI();
        const { type, payload } = req.body;

        switch (type) {
            case 'qualifyLead': {
                const { userInput, stage, history, leadDetails } = payload as { userInput: string; stage: BantStage; history: ChatMessage[]; leadDetails: LeadDetails; };
                const conversationHistory = history.map(m => `${m.sender}: ${m.text}`).join('\n');
                const prompt = `You are an AI assistant for a B2B marketplace called BANTConfirm. Your goal is to qualify a new business lead using the BANT (Budget, Authority, Need, Timeline) framework. Lead Details: Name: ${leadDetails.name}, Company: ${leadDetails.company}, Service Interest: ${leadDetails.service}. Conversation History: ${conversationHistory}\nuser: ${userInput}. Current Qualification Stage: ${stage}. Your Task: Analyze the user's latest message: "${userInput}". Determine if it provides a clear answer for the '${stage}' stage. Extract the key piece of information. Formulate a brief, conversational analysis of their answer. Decide on the next question to ask. If the current stage is satisfied, ask the question for the next stage. If not, ask a clarifying question. Return the analysis in the specified JSON format.`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { responseMimeType: 'application/json', responseSchema: bantResponseSchema },
                });
                
                return res.status(200).json(JSON.parse(response.text));
            }
            
            case 'findSolution': {
                const { query, services, vendors } = payload as { query: string; services: Service[]; vendors: Vendor[]; };
                const serviceList = services.map(s => s.name).join(', ');
                const vendorList = vendors.map(v => `${v.name} (Specialties: ${v.specialties.join(', ')})`).join('; ');
                const prompt = `You are an expert AI consultant for BANTConfirm, a B2B marketplace. A user needs help. Your task is to analyze their request and recommend the best service and vendors. USER'S REQUEST: "${query}". AVAILABLE SERVICES: ${serviceList}. AVAILABLE VENDORS: ${vendorList}. YOUR TASK: 1. Understand the user's core need. 2. Identify the single most relevant service from AVAILABLE SERVICES. If no service is a good fit, return an empty string for the 'suggestedService' field. 3. Identify up to 3 vendors whose specialties align with the user's need. If no vendors are a good fit, return an empty array for the 'suggestedVendors' field. 4. Write a brief summary explaining your recommendations. 5. Return the result in the specified JSON format.`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { responseMimeType: 'application/json', responseSchema: solutionFinderSchema },
                });
                
                return res.status(200).json(JSON.parse(response.text));
            }

            case 'matchVendors': {
                const { listing, vendors } = payload as { listing: RequirementListing; vendors: Vendor[]; };
                const vendorList = vendors.map(v => `${v.name} (Specialties: ${v.specialties.join(', ')}; Description: ${v.description})`).join('; ');
                const prompt = `You are an AI B2B matching engine. Analyze a new user requirement and find the best-suited vendors. USER REQUIREMENT: Title: "${listing.title}", Category: "${listing.category}", Description: "${listing.description}". AVAILABLE VENDORS: ${vendorList}. YOUR TASK: 1. Understand the requirement. 2. Compare it against vendor specialties. 3. Identify the top 2-3 matches. 4. For each, provide a one-sentence justification. 5. Return the list in the specified JSON format. Return an empty array if no good matches are found.`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { responseMimeType: 'application/json', responseSchema: vendorMatchingSchema },
                });

                return res.status(200).json(JSON.parse(response.text));
            }

            default:
                return res.status(400).json({ error: 'Invalid request type' });
        }
    } catch (error) {
        console.error('Error in /api/gemini:', error);
        return res.status(500).json({ error: 'An internal server error occurred.' });
    }
}
