import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { OutfitRecommendation, Trend, ItemAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const outfitSchema = {
    type: Type.OBJECT,
    properties: {
        outfitName: { type: Type.STRING, description: "Tên gợi ý cho bộ trang phục." },
        description: { type: Type.STRING, description: "Mô tả ngắn gọn về phong cách và dịp phù hợp cho bộ trang phục." },
        items: {
            type: Type.ARRAY,
            description: "Danh sách các món đồ trong bộ trang phục.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "Loại món đồ (ví dụ: Áo, Quần, Váy, Giày, Phụ kiện)." },
                    description: { type: Type.STRING, description: "Mô tả chi tiết về món đồ, bao gồm màu sắc, chất liệu và kiểu dáng." }
                },
                required: ["type", "description"]
            }
        }
    },
    required: ["outfitName", "description", "items"]
};

// Updated schema to expect a direct array of trends
const trendsSchema = {
    type: Type.ARRAY,
    description: "Danh sách các xu hướng thời trang.",
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "Tên của xu hướng." },
            description: { type: Type.STRING, description: "Mô tả về xu hướng." },
            keyItems: {
                type: Type.ARRAY,
                description: "Các món đồ chính của xu hướng.",
                items: { type: Type.STRING }
            }
        },
        required: ["name", "description", "keyItems"]
    }
};

const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
        throw new Error("Không nhận được dữ liệu hình ảnh từ API.");
    } catch (error) {
        console.error("Lỗi khi tạo hình ảnh:", error);
        throw new Error("Không thể tạo hình ảnh.");
    }
};


export const generateOutfit = async (
  bodyShape: string,
  style: string,
  occasion: string,
  weather: string
): Promise<OutfitRecommendation> => {
  const prompt = `Hãy đóng vai một nhà tạo mẫu thời trang chuyên nghiệp. Dựa trên các thông tin sau: Dáng người - ${bodyShape}, Phong cách - ${style}, Dịp - ${occasion}, Thời tiết - ${weather}. Hãy gợi ý một bộ trang phục hoàn chỉnh.`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: outfitSchema,
        },
    });
    const jsonText = response.text.trim();
    const outfitData = JSON.parse(jsonText) as Omit<OutfitRecommendation, 'imageUrl'>;

    const imagePrompt = `Một bức ảnh thời trang full-body, chất lượng cao của một người mẫu đang mặc bộ trang phục sau: ${outfitData.items.map(i => i.description).join(', ')}. Bối cảnh studio tối giản, ánh sáng đẹp.`;
    const imageUrl = await generateImage(imagePrompt);

    return { ...outfitData, imageUrl };
  } catch (error) {
    console.error("Lỗi khi tạo trang phục:", error);
    throw new Error("Không thể tạo gợi ý trang phục. Vui lòng thử lại.");
  }
};

export const fetchTrends = async (category: string): Promise<Trend[]> => {
    // Updated prompt to be more explicit about wanting a JSON array
    const prompt = `Tạo một danh sách JSON gồm ba xu hướng thời trang nổi bật cho chủ đề "${category}". Dữ liệu trả về PHẢI là một mảng các đối tượng JSON, mỗi đối tượng đại diện cho một xu hướng.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: trendsSchema, // Using the updated array schema
            },
        });
        const jsonText = response.text.trim();
        // Parse the response directly as an array
        const trendsData = JSON.parse(jsonText) as Omit<Trend, 'imageUrl'>[];

        const trendsWithImages = await Promise.all(
            trendsData.map(async (trend) => {
                const imagePrompt = `Một collage ảnh thời trang thể hiện xu hướng "${trend.name}". Bao gồm các món đồ chính như ${trend.keyItems.join(', ')}. Phong cách nghệ thuật, hiện đại, sống động.`;
                const imageUrl = await generateImage(imagePrompt);
                return { ...trend, imageUrl };
            })
        );
        return trendsWithImages;
    } catch (error) {
        console.error("Lỗi khi lấy xu hướng:", error);
        throw new Error("Không thể lấy dữ liệu xu hướng. Vui lòng thử lại.");
    }
};

export const analyzeItemByText = async (text: string): Promise<ItemAnalysis> => {
    try {
        const textPrompt = `Cung cấp thông tin về món đồ thời trang sau: "${text}". Mô tả phong cách, các thương hiệu có thể có, và gợi ý cách phối đồ.`;
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: textPrompt,
        });
        const description = textResponse.text;

        const imagePrompt = `Một bức ảnh thời trang, chất lượng cao của món đồ sau: "${text}", được phối trong một bộ trang phục hoàn chỉnh trên người mẫu.`;
        const imageUrl = await generateImage(imagePrompt);

        return { description, imageUrl };
    } catch (error) {
        console.error("Lỗi khi phân tích bằng văn bản:", error);
        throw new Error("Không thể phân tích món đồ. Vui lòng thử lại.");
    }
};

export const analyzeItemByImage = async (base64Image: string, mimeType: string): Promise<ItemAnalysis> => {
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType,
        },
    };

    try {
        const textAnalysisPrompt = {
            parts: [imagePart, { text: "Mô tả món đồ thời trang này. Phong cách của nó là gì, có thể là của những thương hiệu nào, và gợi ý các món đồ để phối cùng?" }],
        };
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: textAnalysisPrompt,
        });
        const description = textResponse.text;

        const imageGenerationPrompt = {
            parts: [imagePart, { text: "Tạo một hình ảnh mới, trong đó một người mẫu đang mặc món đồ này như một phần của một bộ trang phục thời trang hoàn chỉnh. Giữ lại phong cách của món đồ gốc nhưng đặt nó trong một bối cảnh mới." }],
        };

        const imageResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: imageGenerationPrompt,
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        const part = imageResponse.candidates?.[0]?.content?.parts?.[0];
        if (!part?.inlineData) {
            throw new Error("Không thể tạo hình ảnh phối đồ.");
        }
        const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        
        return { description, imageUrl };
    } catch (error) {
        console.error("Lỗi khi phân tích bằng hình ảnh:", error);
        throw new Error("Không thể phân tích món đồ từ hình ảnh. Vui lòng thử lại.");
    }
};