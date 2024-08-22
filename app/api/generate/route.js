
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("API Key is missing");
  throw new Error("API Key is missing. Please check your environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
    You are a Flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content.
    - Create clear and concise questions for the front of the flashcards.
    - Provide accurate answers on the back of the flashcards.
    - Focus on one concept per flashcard.
    - Use simple language.
    - Include a variety of question types (definitions, examples, comparisons, applications).
    - Tailor the difficulty level to the user's preference.
    - Provide 1 to 5-word answers.
    - Limit to nine questions, but fewer if appropriate.
    You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}

  `,
});

const generationConfig = {
  temperature: 1.5,
  topP: 0.9,
  topK: 50,
  maxOutputTokens: 1500,
  //responseMimeType: "text/plain",
};

async function generateFlashcards(topic, difficulty) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const message = `Generate flashcards on the topic "${topic}" with difficulty level "${difficulty}".`;
    const result = await chatSession.sendMessage(message);

    let responseText = result.response.text();

    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    // Attempt to parse the cleaned response
    const flashcardsData = JSON.parse(responseText);
    return flashcardsData.flashcards;
  } catch (error) {
    console.error("Error parsing response or fetching flashcards:", error.message);
    return [];
  }
}

export async function POST(req) {
  try {
    const { topic, difficulty } = await req.json();

    if (!topic || !difficulty) {
      return new Response(
        JSON.stringify({ error: "Missing topic or difficulty." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const flashcards = await generateFlashcards(topic, difficulty);

    if (!flashcards || flashcards.length === 0) {
      return new Response(
        JSON.stringify({ error: "Failed to generate flashcards." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ flashcards }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in POST handler:", error.message);

    return new Response(
      JSON.stringify({ error: "Failed to generate flashcards." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
