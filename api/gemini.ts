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

enum LeadPosterStage {
  GREETING = 'GREETING',
  DETAILS = 'DETAILS',
  BUDGET = 'BUDGET',
  AUTHORITY = 'AUTHORITY',
  NEED = 'NEED',
  TIMELINE = 'TIMELINE',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
}

interface LeadDetails {
  name: string;
  company: string;
  email: string;
  mobile?: string;
  service: string;
}

interface User {
  id: number;
  name: string;
  companyName?: string;
  email: string;
  mobile?: string;
  location?: string;
  isAdmin?: boolean;
}

interface BantData {
  [BantStage.BUDGET]: string;
  [BantStage.AUTHORITY]: string;
  [BantStage.NEED]: string;
  [BantStage.TIMELINE]: string;
}

type LeadStatus = 'New' | 'Assigned';

interface QualifiedLead {
  id: number;
  leadDetails: LeadDetails;
  bantData: BantData;
  qualifiedAt: string; // ISO String
  status: LeadStatus;
  assignedVendorNames: string[];
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

const requirementGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        analysis: { type: Type.STRING, description: "Your brief, conversational analysis of the user's input." },
        isStageComplete: { type: Type.BOOLEAN, description: "A boolean indicating if the goal for the current stage is met." },
        nextQuestion: { type: Type.STRING, description: "The next question to ask the user." },
        
        extractedTitle: { type: Type.STRING, description: "The title for the requirement listing." },
        extractedDescription: { type: Type.STRING, description: "The detailed description of the customer's need." },
        extractedCategory: {
            type: Type.STRING,
            enum: ['Software', 'Hardware', 'Service', ''],
            description: "The category of the requirement."
        },
        
        extractedBantData: {
            type: Type.OBJECT,
            properties: {
                [BantStage.BUDGET]: { type: Type.STRING },
                [BantStage.AUTHORITY]: { type: Type.STRING },
                [BantStage.NEED]: { type: Type.STRING },
                [BantStage.TIMELINE]: { type: Type.STRING },
            }
        },
    },
    required: ['analysis', 'isStageComplete', 'nextQuestion'],
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

const leadVendorMatchingSchema = {
    type: Type.ARRAY,
    items: { type: Type.STRING }
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

            case 'generateRequirement': {
                const { userInput, stage, history, currentUser } = payload as { userInput: string; stage: LeadPosterStage; history: ChatMessage[]; currentUser: User; };
                const conversationHistory = history.map(m => `${m.sender}: ${m.text}`).join('\n');
                
                const prompt = `You are an AI assistant for BANTConfirm, a B2B marketplace. Your goal is to help a user, '${currentUser.name}', post a new customer requirement by having a conversation. You need to gather requirement details (Title, Description, Category) and then qualify it with BANT parameters (Budget, Authority, Need, Timeline).

                The conversation history is:
                ${conversationHistory}
                user: ${userInput}

                The current stage of the conversation is: ${stage}.

                **Your Task:**
                Analyze the user's latest message ("${userInput}") based on the current stage and respond in the required JSON format.
                
                **Stage-by-stage Instructions:**

                1.  **Stage 'GREETING' or 'DETAILS':**
                    - Your goal is to gather the Title, Description, and a Category ('Software', 'Hardware', 'Service').
                    - Analyze the user's input for any of these details.
                    - If all three are gathered, set \`isStageComplete\` to \`true\`. Your \`nextQuestion\` should be about the budget (e.g., "Thanks! Now, let's qualify this lead. What is the customer's estimated budget?").
                    - If information is missing, set \`isStageComplete\` to \`false\` and ask for the missing piece in \`nextQuestion\`. For example, "What would be a good title for this?".
                    - Populate the \`extractedTitle\`, \`extractedDescription\`, and \`extractedCategory\` fields with any information you've gathered.

                2.  **Stage 'BUDGET', 'AUTHORITY', 'NEED', 'TIMELINE':**
                    - Your goal is to get a clear answer for the current BANT stage.
                    - Analyze the user's input.
                    - If you get a clear answer, set \`isStageComplete\` to \`true\`. Populate the corresponding field in \`extractedBantData\`. Formulate the \`nextQuestion\` for the *next* BANT stage (e.g., if stage is BUDGET, ask about AUTHORITY).
                    - If the answer is unclear, set \`isStageComplete\` to \`false\` and ask a clarifying question in \`nextQuestion\`.
                    
                3.  **Stage 'REVIEW':**
                    - The user is reviewing a summary you provided.
                    - If their input is a confirmation ("confirm", "looks good", "post it"), set \`isStageComplete\` to \`true\`. Your \`analysis\` can be "Confirmation received." and \`nextQuestion\` can be empty.
                    - If they want to change something, analyze their change request. Set \`isStageComplete\` to \`false\`. Update the relevant extracted fields and for \`nextQuestion\`, say "OK, I've updated that. Does everything else look correct?".

                **General Rules:**
                - \`analysis\`: Your brief, conversational thought process.
                - \`isStageComplete\`: Boolean. \`true\` if the goal for the current stage is met.
                - \`nextQuestion\`: The next thing you will say to the user.
                - Always return the full JSON schema, but only populate the 'extracted' fields relevant to the current or previous stages. For BANT stages, only populate the field for that specific stage within \`extractedBantData\`.
                `;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { responseMimeType: 'application/json', responseSchema: requirementGenerationSchema },
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

            case 'matchVendorsToLead': {
                const { lead, vendors } = payload as { lead: QualifiedLead; vendors: Vendor[] };
                const vendorList = vendors.map(v => `${v.name} (Specialties: ${v.specialties.join(', ')}; Description: ${v.description})`).join('; ');
                const prompt = `You are an AI B2B matching engine for a marketplace called BANTConfirm. Your task is to analyze a qualified sales lead and find the most suitable vendors.

                LEAD DETAILS:
                - Service of Interest: "${lead.leadDetails.service}"
                - BANT Summary:
                    - Budget: "${lead.bantData.BUDGET}"
                    - Authority: "${lead.bantData.AUTHORITY}"
                    - Need: "${lead.bantData.NEED}"
                    - Timeline: "${lead.bantData.TIMELINE}"

                AVAILABLE VENDORS:
                ${vendorList}

                YOUR TASK:
                1. Carefully review the lead's service interest and BANT summary.
                2. Compare this information against the available vendors' specialties and descriptions.
                3. Identify the top 2-3 vendors that are the best fit for this specific lead. Prioritize vendors whose specialties directly match the service of interest.
                4. Return ONLY the names of the matched vendors in a JSON array of strings. For example: ["CloudNet Solutions", "SecureData Corp"].
                5. If no vendors are a good match, return an empty array [].`;
                
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { responseMimeType: 'application/json', responseSchema: leadVendorMatchingSchema },
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