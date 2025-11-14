
import { GoogleGenAI, Type } from '@google/genai';
import { BantStage, ChatMessage, GeminiResponse, LeadDetails, AIRecommendation, Vendor, Service, RequirementListing, AIMatch } from '../types';

// Lazily initialize the GoogleGenAI instance to prevent startup errors
// when the API key is not yet available.
let aiInstance: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!aiInstance) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      // This should not be reached if the App component's check is working,
      // but it's a safeguard.
      throw new Error("API Key not found. Please set API_KEY environment variable.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};


const bantResponseSchema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.STRING,
      description: "A brief, conversational analysis of the user's input. For example, if they provide a budget, say 'Great, that budget works.'",
    },
    extractedData: {
      type: Type.STRING,
      description: "The specific piece of data extracted from the user's answer that satisfies the current BANT stage. For example, '$10,000/month' or 'The CTO, Jane Smith'.",
    },
    isStageComplete: {
      type: Type.BOOLEAN,
      description: "Set to true if the user has provided a satisfactory answer for the current stage, otherwise false.",
    },
    nextQuestion: {
      type: Type.STRING,
      description: "The next question to ask the user. If the stage is complete, this should be the question for the NEXT BANT stage. If not complete, this should be a clarifying question for the CURRENT stage.",
    },
  },
  required: ['analysis', 'extractedData', 'isStageComplete', 'nextQuestion'],
};


export const qualifyLead = async (
  userInput: string,
  stage: BantStage,
  history: ChatMessage[],
  leadDetails: LeadDetails
): Promise<GeminiResponse> => {

  const conversationHistory = history.map(m => `${m.sender}: ${m.text}`).join('\n');
  
  const prompt = `
    You are an AI assistant for a B2B marketplace called BANTConfirm. Your goal is to qualify a new business lead using the BANT (Budget, Authority, Need, Timeline) framework.

    Lead Details:
    - Name: ${leadDetails.name}
    - Company: ${leadDetails.company}
    - Service Interest: ${leadDetails.service}

    Conversation History:
    ${conversationHistory}
    user: ${userInput}

    Current Qualification Stage: ${stage}

    Your Task:
    1. Analyze the user's latest message: "${userInput}".
    2. Determine if it provides a clear answer for the '${stage}' stage.
    3. Extract the key piece of information.
    4. Formulate a brief, conversational analysis of their answer.
    5. Decide on the next question to ask. If the current stage is satisfied, ask the question for the next stage. If not, ask a clarifying question.
    6. Return the analysis in the specified JSON format.
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: bantResponseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText) as GeminiResponse;
    return parsedResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback in case of API error
    return {
      analysis: "I'm having a little trouble processing that.",
      extractedData: "N/A",
      isStageComplete: false,
      nextQuestion: "Could you please rephrase your response?",
    };
  }
};


const solutionFinderSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A friendly, conversational summary of the user's needs and your recommendation. Explain WHY you are suggesting the service and vendors.",
        },
        suggestedService: {
            type: Type.STRING,
            description: "The single best matching service name from the provided list. If no service is a clear match, return null.",
        },
        suggestedVendors: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of vendor names that are a good fit for the user's request, based on their specialties. Recommend 2-3 vendors if possible.",
        },
    },
    required: ["summary", "suggestedService", "suggestedVendors"],
};

export const findSolution = async (query: string, services: Service[], vendors: Vendor[]): Promise<AIRecommendation> => {
    const serviceList = services.map(s => s.name).join(', ');
    const vendorList = vendors.map(v => `${v.name} (Specialties: ${v.specialties.join(', ')})`).join('; ');

    const prompt = `
      You are an expert AI consultant for BANTConfirm, a B2B marketplace for IT and software.
      A user needs help finding a solution. Your task is to analyze their request and recommend the best service category and specific vendors from our platform.

      USER'S REQUEST: "${query}"

      AVAILABLE SERVICES:
      ${serviceList}

      AVAILABLE VENDORS AND THEIR SPECIALTIES:
      ${vendorList}

      YOUR TASK:
      1.  Read the user's request carefully to understand their core need.
      2.  From the list of AVAILABLE SERVICES, identify the single most relevant service category. If nothing matches well, you can identify that no specific service fits.
      3.  From the list of AVAILABLE VENDORS, identify 2-3 vendors whose specialties align with the user's request and the service category you identified.
      4.  Write a brief, helpful summary explaining your recommendations.
      5.  Return the result in the specified JSON format.

      Example: If a user asks for "help with moving our servers to the cloud", you should identify 'Cloud Solutions' as the service and recommend vendors like 'CloudNet Solutions' and 'ConnectSphere'.
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: solutionFinderSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText) as AIRecommendation;
        return parsedResponse;

    } catch (error) {
        console.error("Error calling Gemini API for solution finding:", error);
        return {
            summary: "I encountered an issue while analyzing your request. Please try rephrasing or be more specific about your needs.",
            suggestedService: null,
            suggestedVendors: [],
        };
    }
};

const vendorMatchingSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      vendorName: {
        type: Type.STRING,
        description: "The name of the matched vendor."
      },
      justification: {
        type: Type.STRING,
        description: "A brief, one-sentence explanation for why this vendor is a good match for the requirement."
      }
    },
    required: ["vendorName", "justification"]
  }
};

export const matchVendorsToListing = async (listing: RequirementListing, vendors: Vendor[]): Promise<AIMatch[]> => {
    const vendorList = vendors.map(v => `${v.name} (Specialties: ${v.specialties.join(', ')}; Description: ${v.description})`).join('; ');

    const prompt = `
      You are an AI B2B matching engine for BANTConfirm. Your job is to analyze a new user requirement and find the best-suited vendors from a provided list.

      USER REQUIREMENT:
      - Title: "${listing.title}"
      - Category: "${listing.category}"
      - Description: "${listing.description}"

      AVAILABLE VENDORS:
      ${vendorList}

      YOUR TASK:
      1.  Carefully read the user's requirement to understand their core needs.
      2.  Compare the requirement against the specialties and descriptions of all available vendors.
      3.  Identify the top 2-3 vendors that are the strongest match.
      4.  For each matched vendor, provide a concise, one-sentence justification explaining *why* they are a good fit.
      5.  Return the list of matched vendors and their justifications in the specified JSON format. Return an empty array if no good matches are found.
    `;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: vendorMatchingSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText) as AIMatch[];
        return parsedResponse;

    } catch (error) {
        console.error("Error calling Gemini API for vendor matching:", error);
        return [];
    }
};
