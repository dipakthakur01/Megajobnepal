import React from 'react';

export function SimpleTestApp() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-orange-600 mb-4">MegaJobNepal Test</h1>
        <p className="text-gray-600 mb-6">App is working correctly!</p>
        <div className="text-sm text-gray-500">
          <p>✅ React rendering successfully</p>
          <p>✅ Tailwind CSS loaded</p>
          <p>✅ No timeout errors</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Test Reload
        </button>
      </div>
    </div>
  );
}