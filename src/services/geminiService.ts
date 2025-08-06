import { GoogleGenAI } from "@google/genai";
import type { GameState } from '../types';
import { GAME_SYSTEM_INSTRUCTION, INITIAL_GAME_PROMPT, GAME_STATE_SCHEMA } from '../constants';

const API_KEY = import.meta.env.VITE_API_KEY;
if (!API_KEY) {
    throw new Error("VITE_API_KEY environment variable not set. Please create a .env file in the root directory and add VITE_API_KEY=YOUR_API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function parseOrThrow(jsonString: string): GameState {
    let cleanedString = jsonString.trim();
    if (cleanedString.startsWith('```json')) {
        cleanedString = cleanedString.substring(7).trim();
    }
    if (cleanedString.endsWith('```')) {
        cleanedString = cleanedString.slice(0, -3).trim();
    }

    try {
        const parsed = JSON.parse(cleanedString);
        // More robust validation
        if (
            parsed &&
            typeof parsed.sceneDescription === 'string' &&
            typeof parsed.imagePrompt === 'string' &&
            Array.isArray(parsed.actions) &&
            typeof parsed.characterStatus === 'string' &&
            typeof parsed.health === 'number' &&
            Array.isArray(parsed.inventory) &&
            typeof parsed.gameOver === 'boolean' &&
            typeof parsed.gameWon === 'boolean' &&
            typeof parsed.storyRecap === 'string' &&
            typeof parsed.generateImage === 'boolean'
        ) {
            return parsed as GameState;
        }
        console.error("Parsed JSON is missing required GameState properties:", parsed);
        throw new Error("JSON تجزیه‌شده با ساختار GameState مطابقت ندارد");
    } catch (e) {
        console.error("Failed to parse JSON response from AI:", jsonString);
        console.error("Cleaned string before parsing:", cleanedString);
        throw new Error(`هوش مصنوعی پاسخی با فرمت نادرست برگرداند. ${(e as Error).message}`);
    }
}


export const generateGameState = async (playerAction: string, previousState?: GameState): Promise<GameState> => {
    let prompt: string;
    if (playerAction === "START_GAME" || !previousState) {
        prompt = INITIAL_GAME_PROMPT;
    } else {
        const inventoryString = previousState.inventory.length > 0 ? previousState.inventory.join(', ') : 'خالی';
        prompt = `با توجه به وضعیت فعلی، بازیکن اقدام زیر را انجام می‌دهد: «${playerAction}». ابتدا، بررسی کن که آیا این اقدام با توجه به وضعیت بازیکن («${previousState.characterStatus}»)، سلامتی او (${previousState.health})، موجودی او ([${inventoryString}]) و قوانین دنیای بازی امکان‌پذیر است یا خیر. سپس نتیجه را توصیف کن. اگر اقدام غیرممکن بود، توضیح بده چرا و اقدامات جایگزین ارائه بده. وضعیت قبلی برای زمینه: «${previousState.sceneDescription}». خلاصه آخرین رویداد: «${previousState.storyRecap}».`;
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: GAME_SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: GAME_STATE_SCHEMA,
            temperature: 0.9,
        }
    });
    
    const rawText = response.text;
    if (!rawText) {
        throw new Error("پاسخ خالی از هوش مصنوعی دریافت شد.");
    }
    
    try {
        return parseOrThrow(rawText);
    } catch(e) {
        console.error("Original malformed response from AI:", rawText);
        throw e;
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("هوش مصنوعی تصویری برنگرداند.");

    } catch (error) {
        console.error("Failed to generate image:", error);
        throw new Error("تولید تصویر با شکست مواجه شد. شاید موجودات تاریکی جلوی دید شما را گرفته‌اند.");
    }
};
