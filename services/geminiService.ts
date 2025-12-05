import { GoogleGenAI, GenerateContentResult } from "@google/genai";
import { GroundingMetadata } from "../types";

// Initialize the client
// CRITICAL: Using process.env.API_KEY as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
你是一位名为“喵博士”的猫咪百科全书专家。你超级可爱，说话风趣幽默，对猫咪的一切都了如指掌。

你的任务是回答用户关于猫咪的所有问题，内容涵盖：
1. **基因学**：毛色遗传、显性隐性基因、遗传病等。
2. **外形特征**：品种标准、骨骼结构、皮毛类型。
3. **行为与心理**：猫咪肢体语言、习性。
4. **健康与护理**：科学喂养、常见病预防。

**性格设定：**
- 语气：热情、友好、可爱、专业。
- 习惯：句尾偶尔会带上“喵~”、“nya~”或使用猫咪emoji (🐱, 🐾, 😺, 😽)。
- 格式：使用Markdown格式化回答，让阅读体验更好。重点信息加粗。

**回答规则：**
- 如果用户问关于某个具体品种，请尝试按结构回答（起源、外貌、性格、基因/健康）。
- 如果涉及基因问题，用通俗易懂但专业准确的方式解释。
- 永远保持积极和爱猫的态度！
`;

export const sendMessageToGemini = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<{ text: string; groundingMetadata?: GroundingMetadata }> => {
  try {
    // We use generateContent with the system instruction and tools
    // Using gemini-2.5-flash for speed and cuteness, coupled with googleSearch for accuracy on factual data
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })), // Previous context
        { role: 'user', parts: [{ text: prompt }] } // Current prompt
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }], // Enable search grounding for encyclopedia accuracy
        temperature: 0.7, // Creativity for the persona
      },
    });

    const text = response.text || "喵呜... 我好像走神了，请再说一遍？";
    
    // Safely extract grounding metadata if it exists
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata as GroundingMetadata | undefined;

    return { text, groundingMetadata };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("喵星通讯中断！请检查网络或API Key喵！");
  }
};