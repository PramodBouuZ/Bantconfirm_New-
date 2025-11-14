

import React from 'react';

const ApiKeyError: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="max-w-2xl p-8 bg-white rounded-xl shadow-lg text-center border-t-4 border-red-500">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuration Error</h2>
      {/* FIX: Updated error message to reference API_KEY and provide generic instructions. */}
      <p className="text-gray-600 mb-6">
        The application requires an environment variable named <code className="bg-gray-200 text-red-700 font-mono p-1 rounded">API_KEY</code> to connect to the AI service, but it was not found.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg text-left text-sm">
        <p className="font-semibold text-gray-800 mb-2">How to Fix on your deployment platform (e.g., Vercel):</p>
        <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>Go to your Project Settings &rarr; <strong>Environment Variables</strong>.</li>
            <li>
                Create a new variable with the name <code className="bg-gray-200 text-green-700 font-mono p-0.5 rounded">API_KEY</code>.
            </li>
            <li>Paste your Google AI API key as the value.</li>
            <li>Ensure the variable is set for all environments (Production, Preview, and Development).</li>
            <li>
                <strong>Create a new deployment</strong> for the change to take effect.
            </li>
        </ol>
      </div>
    </div>
  </div>
);

export default ApiKeyError;