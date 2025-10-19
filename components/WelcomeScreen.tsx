
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-2xl bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700">
        <h1 className="text-4xl md:text-5xl font-bold text-sky-400 mb-4">
          VSEPR Theory AI Quiz
        </h1>
        <p className="text-slate-300 text-lg mb-8">
          Test your chemistry knowledge! This quiz uses AI to generate questions and molecular structures based on VSEPR theory. Can you determine the geometry, bond angles, and polarity?
        </p>
        <button
          onClick={onStart}
          className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition-transform duration-200 ease-in-out transform hover:scale-105 shadow-lg"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
