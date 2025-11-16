
import React, { useState, useRef, useEffect } from 'react';
import { LeadDetails, ChatMessage, BantData, BantStage } from '../types';
import useBantAssistant from '../hooks/useBantAssistant';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { BANT_STAGES_ORDER } from '../constants';
import { CheckIcon } from './icons/CheckIcon';

interface BantAssistantProps {
  leadDetails: LeadDetails;
  onComplete: (data: BantData) => void;
}

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isAI = message.sender === 'ai';
  return (
    <div className={`flex items-start gap-3 ${isAI ? '' : 'justify-end'}`}>
      {isAI && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center"><BotIcon /></div>}
      <div className={`max-w-md p-3 rounded-xl ${isAI ? 'bg-gray-200 text-gray-800 rounded-tl-none' : 'bg-indigo-600 text-white rounded-br-none'}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
       {!isAI && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center"><UserIcon /></div>}
    </div>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="flex items-start gap-3">
     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center"><BotIcon /></div>
    <div className="bg-gray-200 text-gray-800 p-3 rounded-xl rounded-tl-none">
      <div className="flex items-center justify-center space-x-1">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  </div>
);

const BantAssistant: React.FC<BantAssistantProps> = ({ leadDetails, onComplete }) => {
  const [userInput, setUserInput] = useState('');
  const { messages, isLoading, sendMessage, currentStage, bantData } = useBantAssistant(leadDetails);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentStage === BantStage.COMPLETED && bantData) {
      setTimeout(() => onComplete(bantData), 2000); // Give user time to read final message
    }
  }, [currentStage, bantData, onComplete]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (userInput.trim() && !isLoading) {
      sendMessage(userInput.trim());
      setUserInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentStageIndex = currentStage === BantStage.COMPLETED ? BANT_STAGES_ORDER.length : BANT_STAGES_ORDER.indexOf(currentStage);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col h-[80vh]">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 text-center">AI Qualification Assistant</h2>
        <p className="text-sm text-gray-500 text-center">Please answer a few questions to qualify your request.</p>
        
        {/* BANT Progress Indicator */}
        <div className="mt-6 mb-10 px-6 sm:px-2">
            <ol className="flex items-center">
                {BANT_STAGES_ORDER.map((stage, index) => {
                    const isCompleted = currentStageIndex > index;
                    const isCurrent = currentStageIndex === index;
                    const stageName = stage.charAt(0) + stage.slice(1).toLowerCase();

                    const indicatorClasses = [
                      'flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300',
                      isCompleted ? 'bg-green-500 text-white' : '',
                      isCurrent ? 'bg-indigo-600 text-white ring-4 ring-indigo-200' : '',
                      !isCompleted && !isCurrent ? 'bg-gray-200 text-gray-600' : '',
                    ].filter(Boolean).join(' ');

                    const connectorClasses = [
                      'flex-auto border-t-2 transition-colors duration-500',
                      isCompleted ? 'border-green-500' : 'border-gray-200',
                    ].filter(Boolean).join(' ');

                    return (
                        <React.Fragment key={stage}>
                            <li className="relative flex flex-col items-center">
                                <div className={indicatorClasses}>
                                    {isCompleted ? <CheckIcon /> : index + 1}
                                </div>
                                <p className={`absolute top-10 text-xs font-semibold text-center transition-colors duration-300 ${isCurrent ? 'text-indigo-600' : 'text-gray-500'}`}>
                                    {stageName}
                                </p>
                            </li>
                            {index < BANT_STAGES_ORDER.length - 1 && (
                                <li className={connectorClasses}></li>
                            )}
                        </React.Fragment>
                    );
                })}
            </ol>
        </div>
      </div>
      <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <Message key={index} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="relative">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer here..."
            className="w-full p-3 pr-16 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows={1}
            disabled={isLoading || currentStage === BantStage.COMPLETED}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !userInput.trim() || currentStage === BantStage.COMPLETED}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white disabled:bg-gray-300 hover:bg-indigo-700 transition-colors"
          >
            <PaperAirplaneIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BantAssistant;
