import React, { useState, useEffect } from 'react';
import type { VseprDataItem, UserAnswers, EvaluationResult } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface QuizScreenProps {
  question: VseprDataItem;
  questionNumber: number;
  totalQuestions: number;
  onSubmit: (answers: UserAnswers) => Promise<EvaluationResult>;
  onNext: () => void;
}

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);


const QuizScreen: React.FC<QuizScreenProps> = ({ question, questionNumber, totalQuestions, onSubmit, onNext }) => {
  const [answers, setAnswers] = useState<UserAnswers>({
    molecularGeometry: '',
    bondAngles: '',
    polarity: '',
  });
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAnswers({ molecularGeometry: '', bondAngles: '', polarity: '' });
    setFeedback(null);
    setIsSubmitting(false);
  }, [question]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAnswers(prev => ({ ...prev, [name]: value }));
  };

  const handlePolarityClick = (polarity: 'polar' | 'nonpolar') => {
    setAnswers(prev => ({ ...prev, polarity }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answers.polarity) {
        alert("Please select a polarity.");
        return;
    }
    setIsSubmitting(true);
    const result = await onSubmit(answers);
    setFeedback(result);
    setIsSubmitting(false);
  };
  
  const getInputColor = (isCorrect: boolean | undefined) => {
    if (isCorrect === true) return 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500';
    if (isCorrect === false) return 'border-rose-500 focus:border-rose-500 focus:ring-rose-500';
    return 'border-slate-600 focus:border-sky-500 focus:ring-sky-500';
  }

  const getPolarityButtonClasses = (buttonPolarity: 'polar' | 'nonpolar') => {
    const baseClasses = 'w-full text-center p-3 rounded-lg border-2 font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';
    const isSelected = answers.polarity === buttonPolarity;

    if (feedback) {
        const isCorrect = feedback.polarity.isCorrect;
        const isThisButtonCorrect = buttonPolarity === question.polarity;

        if (isCorrect && isSelected) {
            return `${baseClasses} bg-emerald-500/20 border-emerald-500 text-emerald-300`;
        }
        if (!isCorrect && isSelected) {
            return `${baseClasses} bg-rose-500/20 border-rose-500 text-rose-300`;
        }
        if (isThisButtonCorrect) {
             return `${baseClasses} bg-emerald-500/20 border-emerald-500 text-emerald-300`;
        }
        return `${baseClasses} bg-slate-800 border-slate-700 opacity-50`;
    }

    if (isSelected) {
        return `${baseClasses} bg-sky-500/20 border-sky-500 ring-2 ring-sky-500`;
    }

    return `${baseClasses} bg-slate-700 border-slate-600 hover:bg-slate-600`;
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-700">
        
        <div className="w-full bg-slate-700 rounded-full h-2.5 mb-6">
            <div className="bg-sky-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}></div>
        </div>

        <div className="text-center mb-6">
            <p className="text-sky-400 font-semibold">Question {questionNumber} / {totalQuestions}</p>
            <h2 className="text-2xl md:text-3xl font-bold mt-2">
                Identify the Molecular Properties
            </h2>
            <p className="text-slate-400 mt-1">
                Total Electron Pairs: <span className="font-bold text-yellow-400">{question.totalElectronPairs}</span> | Lone Pairs: <span className="font-bold text-yellow-400">{question.lonePairs}</span>
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="molecularGeometry" className="block text-sm font-medium text-slate-300 mb-1">Molecular Geometry Name</label>
            <div className="relative">
                <input
                    type="text"
                    id="molecularGeometry"
                    name="molecularGeometry"
                    value={answers.molecularGeometry}
                    onChange={handleInputChange}
                    disabled={!!feedback}
                    className={`w-full bg-slate-700 text-slate-200 rounded-md p-2 border-2 transition-colors pr-10 ${getInputColor(feedback?.molecularGeometry.isCorrect)}`}
                    placeholder="e.g., Bent, Seesaw..."
                    required
                />
                {feedback && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {feedback.molecularGeometry.isCorrect ? <CheckIcon /> : <XIcon />}
                  </div>
                )}
            </div>
            {feedback && <p className={`text-sm mt-1 ${feedback.molecularGeometry.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>{feedback.molecularGeometry.feedback}</p>}
          </div>
            <div>
            <label htmlFor="bondAngles" className="block text-sm font-medium text-slate-300 mb-1">Bond Angle(s)</label>
             <div className="relative">
                <input
                    type="text"
                    id="bondAngles"
                    name="bondAngles"
                    value={answers.bondAngles}
                    onChange={handleInputChange}
                    disabled={!!feedback}
                    className={`w-full bg-slate-700 text-slate-200 rounded-md p-2 border-2 transition-colors pr-10 ${getInputColor(feedback?.bondAngles.isCorrect)}`}
                    placeholder="e.g., 109.5°, <90°..."
                    required
                />
                 {feedback && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {feedback.bondAngles.isCorrect ? <CheckIcon /> : <XIcon />}
                  </div>
                )}
            </div>
            {feedback && <p className={`text-sm mt-1 ${feedback.bondAngles.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>{feedback.bondAngles.feedback}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Polarity</label>
            <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => handlePolarityClick('polar')} disabled={!!feedback} className={getPolarityButtonClasses('polar')}>
                    Polar
                </button>
                <button type="button" onClick={() => handlePolarityClick('nonpolar')} disabled={!!feedback} className={getPolarityButtonClasses('nonpolar')}>
                    Nonpolar
                </button>
            </div>
            {feedback && <p className={`text-sm mt-1 text-center ${feedback.polarity.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>{feedback.polarity.feedback}</p>}
          </div>

            <div className="pt-2">
                {!feedback ? (
                    <button type="submit" disabled={isSubmitting} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">
                        {isSubmitting ? <LoadingSpinner /> : 'Submit Answer'}
                    </button>
                ) : (
                    <button type="button" onClick={onNext} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        {questionNumber === totalQuestions ? 'Show Results' : 'Next Question'}
                    </button>
                )}
            </div>
        </form>
      </div>
    </div>
  );
};

export default QuizScreen;
