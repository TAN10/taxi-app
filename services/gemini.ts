
import { GoogleGenAI, Type } from "@google/genai";
import { Trip, TripCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTripInsights = async (trips: Trip[]) => {
  const prompt = `
    Analyze the following taxi trip data for employees and provide a summary of spending patterns, 
    potential areas for cost-saving, and any unusual activity.
    Data: ${JSON.stringify(trips)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a corporate expense analyst. Provide professional, concise insights.",
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate AI insights. Please check your connection.";
  }
};

export const suggestTripDetails = async (pickup: string, dropoff: string) => {
  const prompt = `Based on a trip from "${pickup}" to "${dropoff}", suggest a likely business purpose and category.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            purpose: { type: Type.STRING },
            category: { type: Type.STRING, description: "One of: Client Meeting, Office Commute, Event, Other" }
          },
          required: ["purpose", "category"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return null;
  }
};
