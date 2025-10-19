import React, { useState } from 'react';
import type { MissedQuestion } from '../types';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  missedQuestions: MissedQuestion[];
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, totalQuestions, missedQuestions, onRestart }) => {
  const [showReview, setShowReview] = useState(false);
  const percentage = Math.round((score / totalQuestions) * 100);
  
  let message = "";
  if (percentage === 100) {
    message = "Perfect Score! You're a VSEPR master!";
  } else if (percentage >= 80) {
    message = "Excellent job! You really know your stuff.";
  } else if (percentage >= 50) {
    message = "Good effort! A little more practice and you'll be an expert.";
  } else {
    message = "Keep studying! VSEPR can be tricky, but you'll get it.";
  }

  const renderAnswerReview = (label: string, userAnswer: string, correctAnswer: string, isCorrect: boolean) => (
     <div className="py-2">
        <p className="font-semibold text-slate-300">{label}</p>
        <div className="flex items-center space-x-2">
            <span className="text-rose-400">Your answer: {userAnswer} {!isCorrect && '✘'}</span>
        </div>
         {!isCorrect && (
            <div className="flex items-center space-x-2">
                <span className="text-emerald-400">Correct answer: {correctAnswer} ✔</span>
            </div>
         )}
     </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700">
        <h1 className="text-4xl font-bold text-sky-400 mb-2">Quiz Complete!</h1>
        <p className="text-lg text-slate-300 mb-6">Your Final Score:</p>
        <div className="text-6xl font-bold text-yellow-400 mb-4">
          {score} / {totalQuestions}
        </div>
        <div className="text-2xl text-slate-200 font-semibold mb-8">
            {message}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onRestart}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-200 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Play Again
            </button>
            {missedQuestions.length > 0 && (
                 <button
                    onClick={() => setShowReview(!showReview)}
                    className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg"
                >
                    {showReview ? 'Hide Review' : 'Review Mistakes'}
                </button>
            )}
        </div>
      </div>

      {showReview && missedQuestions.length > 0 && (
         <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm mt-8 p-6 rounded-2xl shadow-2xl border border-slate-700 text-left">
            <h2 className="text-2xl font-bold text-sky-400 mb-4 text-center">Your Mistakes</h2>
            {missedQuestions.map((miss, index) => (
                <div key={index} className="mb-4 border-b border-slate-700 pb-4 last:border-b-0 last:mb-0 last:pb-0">
                    <p className="font-bold text-lg text-yellow-400">
                        {miss.question.totalElectronPairs} Total Pairs, {miss.question.lonePairs} Lone Pairs
                    </p>
                    {renderAnswerReview('Molecular Geometry', miss.userAnswers.molecularGeometry, miss.question.molecularGeometry, miss.evaluation.molecularGeometry.isCorrect)}
                    {renderAnswerReview('Bond Angle(s)', miss.userAnswers.bondAngles, miss.question.bondAngles, miss.evaluation.bondAngles.isCorrect)}
                    {renderAnswerReview('Polarity', miss.userAnswers.polarity, miss.question.polarity, miss.evaluation.polarity.isCorrect)}
                </div>
            ))}
         </div>
      )}
    </div>
  );
};

export default ResultsScreen;