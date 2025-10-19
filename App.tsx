import React, { useState, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import { evaluateUserAnswers } from './services/geminiService';
import { VSEPR_QUESTIONS } from './data/vseprData';
import type { VseprDataItem, UserAnswers, EvaluationResult, MissedQuestion } from './types';

type GameState = 'welcome' | 'quiz' | 'results' | 'error';

const TOTAL_QUESTIONS = 5;

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [questions, setQuestions] = useState<VseprDataItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [missedQuestions, setMissedQuestions] = useState<MissedQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const startGame = useCallback(() => {
    setError(null);
    setScore(0);
    setCurrentQuestionIndex(0);
    setMissedQuestions([]);
    
    try {
      const selectedQuestions = shuffleArray([...VSEPR_QUESTIONS]).slice(0, TOTAL_QUESTIONS);
      setQuestions(selectedQuestions);
      setGameState('quiz');
    } catch (err) {
       console.error("Error starting game:", err);
       setError('Failed to prepare the quiz. Please refresh the page.');
       setGameState('error');
    }
  }, []);

  const handleAnswerSubmit = async (answers: UserAnswers): Promise<EvaluationResult> => {
    try {
        const currentQuestion = questions[currentQuestionIndex];
        const result = await evaluateUserAnswers(answers, currentQuestion);
        
        if (result.overallCorrect) {
          setScore(prev => prev + 1);
        } else {
          setMissedQuestions(prev => [...prev, {
            question: currentQuestion,
            userAnswers: answers,
            evaluation: result
          }]);
        }
        return result;
    } catch (err) {
        console.error("Error submitting answer:", err);
        setError('There was an issue evaluating your answer. Please try again.');
        // Return a default error state for the UI
         return {
            molecularGeometry: { isCorrect: false, feedback: 'Error evaluating answer.' },
            bondAngles: { isCorrect: false, feedback: 'Error evaluating answer.' },
            polarity: { isCorrect: false, feedback: 'Error evaluating answer.' },
            overallCorrect: false,
        };
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState('results');
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case 'welcome':
        return <WelcomeScreen onStart={startGame} />;
      case 'quiz':
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) {
            setError('Error loading question. Please try restarting the quiz.');
            setGameState('error');
            return null;
        }
        return (
          <QuizScreen
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={TOTAL_QUESTIONS}
            onSubmit={handleAnswerSubmit}
            onNext={nextQuestion}
          />
        );
      case 'results':
        return <ResultsScreen 
            score={score} 
            totalQuestions={TOTAL_QUESTIONS} 
            missedQuestions={missedQuestions}
            onRestart={startGame} 
        />;
      case 'error':
        return (
             <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <div className="max-w-lg bg-rose-900/50 p-8 rounded-xl border border-rose-700">
                    <h2 className="text-2xl font-bold text-rose-300 mb-4">An Error Occurred</h2>
                    <p className="text-rose-200">{error}</p>
                    <button onClick={startGame} className="mt-6 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-lg">
                        Try Again
                    </button>
                </div>
            </div>
        )
      default:
        return <WelcomeScreen onStart={startGame} />;
    }
  };

  return (
    <main className="min-h-screen font-sans">
      {renderContent()}
    </main>
  );
};

export default App;