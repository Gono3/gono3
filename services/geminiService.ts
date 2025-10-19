import { GoogleGenAI, Type } from "@google/genai";
import type { VseprDataItem, UserAnswers, EvaluationResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const evaluationSchema = {
    type: Type.OBJECT,
    properties: {
        molecularGeometry: {
            type: Type.OBJECT,
            properties: {
                isCorrect: { type: Type.BOOLEAN },
                feedback: { type: Type.STRING, description: "Brief explanation for why the user's answer is correct or incorrect." }
            },
            required: ['isCorrect', 'feedback']
        },
        bondAngles: {
            type: Type.OBJECT,
            properties: {
                isCorrect: { type: Type.BOOLEAN },
                feedback: { type: Type.STRING, description: "Brief explanation for why the user's answer is correct or incorrect." }
            },
            required: ['isCorrect', 'feedback']
        },
        polarity: {
            type: Type.OBJECT,
            properties: {
                isCorrect: { type: Type.BOOLEAN },
                feedback: { type: Type.STRING, description: "Brief explanation for why the user's answer is correct or incorrect." }
            },
            required: ['isCorrect', 'feedback']
        }
    },
    required: ['molecularGeometry', 'bondAngles', 'polarity']
}

export async function evaluateUserAnswers(userAnswers: UserAnswers, correctAnswers: VseprDataItem): Promise<EvaluationResult> {
    const prompt = `As a chemistry tutor, strictly evaluate the user's answers for a VSEPR quiz question.
    The user's answers must be precise. For molecular geometry, the name must be an exact match to the standard VSEPR terminology (e.g., 'Trigonal Pyramidal' is correct, but 'pyramid' is not).
    For bond angles, common representations like '<109.5' or '109.5 degrees' are acceptable, but the numeric values must be correct.
    The polarity must be either 'polar' or 'nonpolar'.

    Correct Answers:
    - Molecular Geometry: ${correctAnswers.molecularGeometry}
    - Bond Angles: ${correctAnswers.bondAngles}
    - Polarity: ${correctAnswers.polarity}

    User's Answers:
    - Molecular Geometry: ${userAnswers.molecularGeometry}
    - Bond Angles: ${userAnswers.bondAngles}
    - Polarity: ${userAnswers.polarity}
    
    Provide your evaluation as a JSON object conforming to the schema.
    For feedback, if the answer is correct, say "Correct!". If incorrect, provide a brief, one-sentence explanation.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: evaluationSchema,
            },
        });

        const jsonText = response.text.trim();
        const evalData = JSON.parse(jsonText);

        const overallCorrect = evalData.molecularGeometry.isCorrect && evalData.bondAngles.isCorrect && evalData.polarity.isCorrect;

        return { ...evalData, overallCorrect };

    } catch (error) {
        console.error("Error evaluating answers:", error);
        // Fallback to simple string comparison in case of API error
        const mgCorrect = userAnswers.molecularGeometry.toLowerCase().trim() === correctAnswers.molecularGeometry.toLowerCase().trim();
        const baCorrect = userAnswers.bondAngles.replace(/\s/g, '') === correctAnswers.bondAngles.replace(/\s/g, '');
        const pCorrect = userAnswers.polarity.toLowerCase().trim() === correctAnswers.polarity.toLowerCase().trim();
        return {
            molecularGeometry: { isCorrect: mgCorrect, feedback: mgCorrect ? "Correct!" : `The correct geometry is ${correctAnswers.molecularGeometry}.` },
            bondAngles: { isCorrect: baCorrect, feedback: baCorrect ? "Correct!" : `The correct bond angle is ${correctAnswers.bondAngles}.` },
            polarity: { isCorrect: pCorrect, feedback: pCorrect ? "Correct!" : `The correct polarity is ${correctAnswers.polarity}.` },
            overallCorrect: mgCorrect && baCorrect && pCorrect,
        };
    }
}