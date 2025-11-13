import React from 'react';
import { StoredConversation } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';

interface ConversationHistoryProps {
  conversation: StoredConversation;
  onContinue: () => void;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ conversation, onContinue }) => {
  const formattedDate = new Date(conversation.timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-100 text-indigo-600">
          <HistoryIcon />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-bold text-gray-900">Finish Your Inquiry</h3>
          <p className="text-sm text-gray-600">
            Continue your conversation for <span className="font-semibold">{conversation.leadDetails.service}</span>.
          </p>
          <p className="text-xs text-gray-400">Last activity: {formattedDate}</p>
        </div>
      </div>
      <button
        onClick={onContinue}
        className="w-full sm:w-auto bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex-shrink-0"
      >
        Continue Conversation
      </button>
    </div>
  );
};

export default ConversationHistory;