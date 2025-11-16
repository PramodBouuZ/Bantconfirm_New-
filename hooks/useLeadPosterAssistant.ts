import { useState, useEffect } from 'react';
import { ChatMessage, User, LeadPosterStage, DraftRequirement, BantStage, StoredLeadPosterConversation } from '../types';
import { generateRequirementWithAI } from '../services/geminiService';

export const LEAD_POSTER_STAGES_ORDER: LeadPosterStage[] = [
    LeadPosterStage.DETAILS,
    LeadPosterStage.BUDGET,
    LeadPosterStage.AUTHORITY,
    LeadPosterStage.NEED,
    LeadPosterStage.TIMELINE,
    LeadPosterStage.REVIEW,
];


const useLeadPosterAssistant = (currentUser: User) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<LeadPosterStage>(LeadPosterStage.GREETING);
  const [requirementData, setRequirementData] = useState<DraftRequirement>({
    title: '',
    description: '',
    category: '',
    bantData: {
      [BantStage.BUDGET]: '',
      [BantStage.AUTHORITY]: '',
      [BantStage.NEED]: '',
      [BantStage.TIMELINE]: '',
    }
  });

  const addMessage = (sender: 'user' | 'ai', text: string) => {
    setMessages(prev => [...prev, { sender, text }]);
  };

  useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem('bant_lead_poster_conversation');
      if (savedStateJSON) {
        const savedState: StoredLeadPosterConversation = JSON.parse(savedStateJSON);
        if (savedState.messages && savedState.currentStage !== LeadPosterStage.COMPLETED) {
          setMessages(savedState.messages);
          setRequirementData(savedState.requirementData);
          setCurrentStage(savedState.currentStage);
          return;
        }
      }
    } catch (error) {
      console.error("Could not load lead poster conversation from localStorage", error);
      localStorage.removeItem('bant_lead_poster_conversation');
    }

    addMessage('ai', `Hi ${currentUser.name.split(' ')[0]}! I'm here to help you post a new customer requirement. To start, please describe the customer's need in a few sentences.`);
    setCurrentStage(LeadPosterStage.DETAILS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.name]);

  useEffect(() => {
    if (messages.length > 1 && currentStage !== LeadPosterStage.COMPLETED && currentStage !== LeadPosterStage.GREETING) {
      const conversationState: StoredLeadPosterConversation = {
        messages,
        requirementData,
        currentStage,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('bant_lead_poster_conversation', JSON.stringify(conversationState));
    }
  }, [messages, requirementData, currentStage]);


  const sendMessage = async (userInput: string) => {
    addMessage('user', userInput);
    setIsLoading(true);

    try {
      const response = await generateRequirementWithAI(userInput, currentStage, messages, currentUser);

      if (response.analysis) {
        addMessage('ai', response.analysis);
      }
      
      const updatedData: DraftRequirement = {
          title: response.extractedTitle || requirementData.title,
          description: response.extractedDescription || requirementData.description,
          category: response.extractedCategory || requirementData.category,
          bantData: {
            ...requirementData.bantData,
            ...response.extractedBantData
          }
      };
      setRequirementData(updatedData);

      if (response.isStageComplete) {
          if (currentStage === LeadPosterStage.REVIEW) {
            setCurrentStage(LeadPosterStage.COMPLETED);
            addMessage('ai', "Perfect! Posting this to the marketplace now.");
          } else {
            const currentIndex = LEAD_POSTER_STAGES_ORDER.indexOf(currentStage);
            const nextStage = LEAD_POSTER_STAGES_ORDER[currentIndex + 1];
            setCurrentStage(nextStage as LeadPosterStage);
            
            if (nextStage === LeadPosterStage.REVIEW) {
                const reviewText = `Great! I've drafted the requirement:\n\n**Title:** ${updatedData.title}\n**Category:** ${updatedData.category}\n**Description:** ${updatedData.description}\n\n**BANT Summary:**\n- **Budget:** ${updatedData.bantData.BUDGET}\n- **Authority:** ${updatedData.bantData.AUTHORITY}\n- **Need:** ${updatedData.bantData.NEED}\n- **Timeline:** ${updatedData.bantData.TIMELINE}\n\nIf this looks good, just type 'Confirm' to post it. Otherwise, let me know what you'd like to change.`;
                addMessage('ai', reviewText);
            } else {
                setTimeout(() => addMessage('ai', response.nextQuestion), 500);
            }
          }
      } else {
         setTimeout(() => addMessage('ai', response.nextQuestion), 500);
      }

    } catch (error) {
      console.error('Error generating requirement:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      addMessage('ai', `I'm sorry, an error occurred: "${errorMessage}". Please try rephrasing your answer or try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage, currentStage, requirementData };
};

export default useLeadPosterAssistant;