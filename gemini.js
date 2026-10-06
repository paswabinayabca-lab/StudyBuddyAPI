const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const generateAIResponse = async (prompt) => {
    const models = [
        "gemini-3.7-flash",
        "gemini-3.6-flash",
        "gemini-3.5-flash"
    ];

    let lastError = null;

    for (const model of models) {
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                console.log(
                    `Trying Gemini model: ${model} | Attempt: ${attempt}`
                );

                const response = await ai.models.generateContent({
                    model: model,
                    contents: prompt
                });

                console.log(`Gemini response received using ${model}`);

                return response.text;

            } catch (error) {
                lastError = error;

                console.error(
                    `Gemini Error (${model}, attempt ${attempt}):`,
                    error.message
                );

                if (error.status === 503 && attempt === 1) {
                    console.log("Temporary 503 error. Retrying...");
                    await sleep(3000);
                    continue;
                }

                break;
            }
        }
    }

    console.error("All Gemini models failed.");
    throw lastError;
};

module.exports = {
    generateAIResponse
};