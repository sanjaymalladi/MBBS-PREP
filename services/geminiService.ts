
import { GoogleGenAI, Type } from "@google/genai";
import type { PracticeSession, Subject, Feedback } from '../types';
import { PDF_CONTENT, PDF_METADATA } from '../pdf-content';

// Topic weightage analysis based on PDF content
export const analyzeTopicWeightage = (subject: Subject, topic?: string) => {
  const content = PDF_CONTENT.toLowerCase();

  // Count occurrences of common anatomical/physiological terms
  const topicPatterns = {
    Anatomy: {
      'superior extremity': (content.match(/superior extremity/gi) || []).length,
      'inferior extremity': (content.match(/inferior extremity/gi) || []).length,
      'thorax': (content.match(/thorax/gi) || []).length,
      'abdomen': (content.match(/abdomen/gi) || []).length,
      'cardiac': (content.match(/heart|cardiac|cardiovascular/gi) || []).length,
      'respiratory': (content.match(/lung|respiratory|pulmonary/gi) || []).length,
    },
    Physiology: {
      'cardiovascular': (content.match(/cardiovascular|cardiac|heart/gi) || []).length,
      'respiratory': (content.match(/respiratory|lung|pulmonary/gi) || []).length,
      'blood': (content.match(/blood|hemoglobin|erythrocyte/gi) || []).length,
      'nervous': (content.match(/nervous|nerve|neuron/gi) || []).length,
      'endocrine': (content.match(/endocrine|hormone|thyroid/gi) || []).length,
    },
    Biochemistry: {
      'carbohydrate': (content.match(/carbohydrate|glycolysis|glucose/gi) || []).length,
      'protein': (content.match(/protein|amino acid|enzyme/gi) || []).length,
      'lipid': (content.match(/lipid|fatty acid|cholesterol/gi) || []).length,
      'metabolism': (content.match(/metabolism|metabolic/gi) || []).length,
    }
  };

  // Count question types and marks
  const questionTypeCounts = {
    longEssay: (content.match(/12 marks|long essay/gi) || []).length,
    shortNotes: (content.match(/8 marks|short notes/gi) || []).length,
    applied: (content.match(/5 marks|applied/gi) || []).length,
    mcq: (content.match(/mcq|multiple choice/gi) || []).length,
    reasoning: (content.match(/3 marks|explain why/gi) || []).length,
  };

  return {
    subject,
    topic: topic || 'General',
    topicWeightage: topicPatterns[subject] || {},
    questionTypeDistribution: questionTypeCounts,
    totalContentLength: PDF_CONTENT.length,
    metadata: PDF_METADATA
  };
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const sessionSchema = {
  type: Type.OBJECT,
  properties: {
    subject: { type: Type.STRING },
    topic: { type: Type.STRING },
    longEssayQuestion: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        question: { type: Type.STRING },
        marks: { type: Type.INTEGER },
      },
    },
    multipleChoiceQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING },
          options: {
            type: Type.OBJECT,
            properties: {
              A: { type: Type.STRING },
              B: { type: Type.STRING },
              C: { type: Type.STRING },
              D: { type: Type.STRING },
            },
          },
          correctOption: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
      },
    },
    shortAnswerQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING },
          marks: { type: Type.INTEGER },
        },
      },
    },
    reasoningQuestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          question: { type: Type.STRING },
          marks: { type: Type.INTEGER },
        },
      },
    },
  },
};

const feedbackSchema = {
  type: Type.OBJECT,
  properties: {
    keyConceptsCovered: { type: Type.ARRAY, items: { type: Type.STRING } },
    areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
    clarityAndStructureScore: { type: Type.STRING },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
};

export const generateSession = async (subject: Subject, topic: string): Promise<PracticeSession> => {
  const prompt = `
    You are an expert medical educator specializing in the Indian 1st year MBBS CBME curriculum.
    Your task is to generate a complete, unique practice exam session based on authentic question patterns.

    REQUESTED SUBJECT: ${subject}
    REQUESTED TOPIC: ${topic}

    📋 ANALYSIS INSTRUCTIONS:
    Study the provided past question papers carefully to understand:
    1. TOPIC WEIGHTAGE: Which topics appear most frequently and get higher marks
    2. QUESTION PATTERNS: Common question structures and clinical scenarios
    3. DIFFICULTY LEVELS: Depth of knowledge required for different mark categories
    4. CLINICAL FOCUS: Emphasis on applied anatomy and clinical correlations
    5. MARK DISTRIBUTION: How marks are allocated (12, 8, 5, 3, 1 marks)

    🎯 QUESTION GENERATION RULES:
    - Generate NEW and UNIQUE questions (NOT copies from the reference)
    - Maintain the same clinical focus and difficulty level
    - Use similar question structures and marking patterns
    - Ensure questions are relevant to the requested topic
    - Include appropriate clinical scenarios and applied aspects

    📝 REQUIRED SESSION STRUCTURE:
    - 1 Long Essay Question (10 Marks): Complex clinical scenarios with sub-parts
    - 20 Multiple Choice Questions (1 Mark each): Mini clinical vignettes, single best answer
    - 11 Short Notes / Applied Questions (5 Marks each): Clinical cases and applied theory
    - 5 Reasoning Questions (3 Marks each): "Explain Why" style questions

    🔍 TOPIC ANALYSIS FROM REFERENCE:
    Analyze the reference content to identify:
    - Most frequently tested topics within ${subject}/${topic}
    - Common clinical scenarios and case presentations
    - High-yield areas that get repeated testing
    - Question difficulty progression (easy to complex)

    ✨ QUALITY ASSURANCE:
    - All question IDs must be unique strings
    - Questions should match the cognitive level expected in CBME
    - Include appropriate clinical correlations
    - Maintain authentic medical examination standards

    📚 REFERENCE PAST PAPERS CONTEXT:
    ---
    ${PDF_CONTENT}
    ---

    Based on your analysis of the above reference material, generate a comprehensive practice session that follows the same patterns, weightage, and clinical focus.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: sessionSchema,
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as PracticeSession;

  } catch (error) {
    console.error("Error generating session:", error);
    throw new Error("Failed to communicate with the AI model for session generation.");
  }
};


export const analyzeAnswer = async (questionText: string, imageBase64: string): Promise<Feedback> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: imageBase64,
                        },
                    },
                    {
                        text: `
                          You are an expert medical examiner providing constructive feedback to a 1st year MBBS student.
                          The student was asked the following question: "${questionText}"
                          
                          The student's handwritten answer is in the provided image. 
                          
                          Your tasks are:
                          1. Perform OCR on the image to read the student's answer.
                          2. Analyze the transcribed text for accuracy, completeness, and clarity.
                          3. Provide structured feedback. DO NOT give a numerical score or a simple "right/wrong" grade. Focus on being a helpful, educational guide.
                          
                          Your feedback must be in JSON format.
                        `,
                    },
                ],
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: feedbackSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Feedback;

    } catch (error) {
        console.error("Error analyzing answer:", error);
        throw new Error("Failed to communicate with the AI model for answer analysis.");
    }
};
