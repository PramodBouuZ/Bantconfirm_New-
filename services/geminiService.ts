import { BantStage, ChatMessage, GeminiResponse, LeadDetails, AIRecommendation, Vendor, Service, RequirementListing, AIMatch, QualifiedLead, User, LeadPosterStage } from '../types';

// Centralized API call handler
const callGeminiApi = async (type: string, payload: any) => {
    try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type, payload }),
        });

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;
            try {
                // Try to parse a more specific error message from the response body
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                // Response body is not JSON or is empty, stick with the status text
            }
            console.error(`API error from backend for type "${type}":`, errorMessage);
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error in callGeminiApi for type "${type}":`, error);
        // Re-throw the error to be handled by the calling function.
        // This makes sure network errors (e.g., fetch failing itself) are also propagated.
        throw error;
    }
};


export const qualifyLead = (
  userInput: string,
  stage: BantStage,
  history: ChatMessage[],
  leadDetails: LeadDetails
): Promise<GeminiResponse> => {
  return callGeminiApi('qualifyLead', { userInput, stage, history, leadDetails });
};


export const findSolution = (query: string, services: Service[], vendors: Vendor[]): Promise<AIRecommendation> => {
    return callGeminiApi('findSolution', { query, services, vendors });
};


export const matchVendorsToListing = (listing: RequirementListing, vendors: Vendor[]): Promise<AIMatch[]> => {
    return callGeminiApi('matchVendors', { listing, vendors });
};

export const matchVendorsToLead = (lead: QualifiedLead, vendors: Vendor[]): Promise<string[]> => {
    return callGeminiApi('matchVendorsToLead', { lead, vendors });
};

export const generateRequirementWithAI = (
  userInput: string,
  stage: LeadPosterStage,
  history: ChatMessage[],
  currentUser: User,
) => {
  return callGeminiApi('generateRequirement', { userInput, stage, history, currentUser });
};
