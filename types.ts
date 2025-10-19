export interface VseprDataItem {
  totalElectronPairs: number;
  lonePairs: number;
  electronGeometry: string;
  molecularGeometry: string;
  bondAngles: string;
  polarity: 'polar' | 'nonpolar';
}

export interface UserAnswers {
  molecularGeometry: string;
  bondAngles: string;
  polarity: 'polar' | 'nonpolar' | '';
}

export interface EvaluationResult {
  molecularGeometry: {
    isCorrect: boolean;
    feedback: string;
  };
  bondAngles: {
    isCorrect: boolean;
    feedback: string;
  };
  polarity: {
    isCorrect: boolean;
    feedback: string;
  };
  overallCorrect: boolean;
}

export interface MissedQuestion {
  question: VseprDataItem;
  userAnswers: UserAnswers;
  evaluation: EvaluationResult;
}
