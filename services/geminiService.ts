
import { BantStage, ChatMessage, GeminiResponse, LeadDetails, AIRecommendation, Vendor, Service, RequirementListing, AIMatch } from '../types';

/**
 * All functions now call the `/api/gemini` serverless function,
 * which securely handles the interaction with the Google GenAI API.
 * The payload is structured with a `type` to indicate which operation
 * the backend should perform.
 */

export const qualifyLead = async (
  userInput: string,
  stage: BantStage,
  history: ChatMessage[],
  leadDetails: LeadDetails
): Promise<GeminiResponse> => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'qualifyLead',
        payload: { userInput, stage, history, leadDetails },
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("API error from backend:", errorData.error);
        throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling backend API for qualifyLead:', error);
    // Fallback in case of API error
    return {
      analysis: "I'm having a little trouble processing that.",
      extractedData: "N/A",
      isStageComplete: false,
      nextQuestion: "Could you please rephrase your response?",
    };
  }
};


export const findSolution = async (query: string, services: Service[], vendors: Vendor[]): Promise<AIRecommendation> => {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'findSolution',
                payload: { query, services, vendors },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API error from backend:", errorData.error);
            throw new Error(`API error: ${response.statusText}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Error calling backend API for solution finding:", error);
        return {
            summary: "I encountered an issue while analyzing your request. Please try rephrasing or be more specific about your needs.",
            suggestedService: null,
            suggestedVendors: [],
        };
    }
};


export const matchVendorsToListing = async (listing: RequirementListing, vendors: Vendor[]): Promise<AIMatch[]> => {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'matchVendors',
                payload: { listing, vendors },
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error("API error from backend:", errorData.error);
            throw new Error(`API error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error calling backend API for vendor matching:", error);
        return [];
    }
};
