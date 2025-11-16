


import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, LeadDetails, BantStage, BantData, StoredConversation } from '../types';
import { qualifyLead } from '../services/geminiService';
import { BANT_STAGES_ORDER, BANT_STAGE_PROMPTS } from '../constants';

const useBantAssistant = (leadDetails: LeadDetails) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState<BantStage>(BANT_STAGES_ORDER[0]);
  const [bantData, setBantData] = useState<BantData>({
    [BantStage.BUDGET]: '',
    [BantStage.AUTHORITY]: '',
    [BantStage.NEED]: '',
    [BantStage.TIMELINE]: '',
  });

  const addMessage = (sender: 'user' | 'ai', text: string) => {
    setMessages(prev => [...prev, { sender, text }]);
  };

  const startConversation = useCallback(() => {
    setMessages([]); // Clear previous messages
    addMessage('ai', `Hi ${leadDetails.name}, I'm BANTConfirm's AI assistant. To connect you with the best vendors for ${leadDetails.service}, I'll quickly qualify your request using the BANT framework (Budget, Authority, Need, and Timeline).`);
    setTimeout(() => {
        addMessage('ai', BANT_STAGE_PROMPTS[BANT_STAGES_ORDER[0]]);
    }, 1500); // Increased timeout for longer message
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadDetails.name, leadDetails.service]);

  // Load from local storage or start new on mount
  useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem('bant_conversation');
      if (savedStateJSON) {
        const savedState: StoredConversation = JSON.parse(savedStateJSON);
        // Check if the saved conversation matches the current lead details
        if (savedState.leadDetails.email === leadDetails.email && savedState.leadDetails.service === leadDetails.service) {
          setMessages(savedState.messages);
          setBantData(savedState.bantData);
          setCurrentStage(savedState.currentStage);
          return;
        }
      }
    } catch (error) {
      console.error("Could not load conversation from localStorage", error);
      localStorage.removeItem('bant_conversation'); // Clear corrupted data
    }
    
    // If no valid saved state, start a new conversation
    startConversation();
  }, [leadDetails, startConversation]);


  // Save to local storage on change
  useEffect(() => {
    if (messages.length > 1 && currentStage !== BantStage.COMPLETED) {
      const conversationState: StoredConversation = {
        leadDetails,
        messages,
        bantData,
        currentStage,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem('bant_conversation', JSON.stringify(conversationState));
    }
  }, [messages, bantData, currentStage, leadDetails]);


  const sendMessage = async (userInput: string) => {
    addMessage('user', userInput);
    setIsLoading(true);

    try {
      const response = await qualifyLead(userInput, currentStage, messages, leadDetails);

      if (response.analysis) {
        addMessage('ai', response.analysis);
      }
      
      setBantData(prev => ({ ...prev, [currentStage]: response.extractedData }));

      if (response.isStageComplete) {
        const currentIndex = BANT_STAGES_ORDER.indexOf(currentStage);
        const nextIndex = currentIndex + 1;

        if (nextIndex < BANT_STAGES_ORDER.length) {
          const nextStage = BANT_STAGES_ORDER[nextIndex];
          setCurrentStage(nextStage);
          setTimeout(() => addMessage('ai', response.nextQuestion || BANT_STAGE_PROMPTS[nextStage]), 500);
        } else {
          setCurrentStage(BantStage.COMPLETED);
          setTimeout(() => addMessage('ai', BANT_STAGE_PROMPTS[BANT_STAGES_ORDER[BantStage.COMPLETED]]), 500);
        }
      } else {
         setTimeout(() => addMessage('ai', response.nextQuestion), 500);
      }

    } catch (error) {
      console.error('Error qualifying lead:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      addMessage('ai', `I'm sorry, an error occurred: "${errorMessage}". Please try rephrasing your answer or try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage, currentStage, bantData };
};

export default useBantAssistant;