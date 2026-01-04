
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const startLibrarianChat = (history: any[] = []) => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are SCRIVO, a high-end Intelligent Library OS Guide. 
      Your goal is to suggest research paths, topics, and artifacts based on user neural intent. 
      Be sophisticated, calm, and insightful. 
      Use an ocean-tech, deep-reasoning tone. 
      Help users navigate the deep archive of knowledge.`,
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
};

export async function analyzeBookImage(base64Image: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: 'Analyze this book artifact. Provide a summary, preface highlights, rating (out of 5), and a brief neural review.' }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          preface: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          review: { type: Type.STRING }
        },
        required: ['title', 'summary', 'preface', 'rating', 'review']
      }
    }
  });
  return JSON.parse(response.text || '{}');
}

export async function searchBookByTitle(query: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the artifact: "${query}". Provide a summary, preface highlights, rating (out of 5), and a brief review. Return as JSON.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          preface: { type: Type.STRING },
          rating: { type: Type.NUMBER },
          review: { type: Type.STRING }
        },
        required: ['title', 'summary', 'preface', 'rating', 'review']
      }
    }
  });
  return JSON.parse(response.text || '{}');
}

export async function findNearbyLibraries(lat: number, lng: number) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Locate 5 physical knowledge hubs (libraries) near these coordinates and describe their atmosphere.",
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      }
    },
  });
  
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
}
