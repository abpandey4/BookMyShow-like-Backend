import ai from "../config/gemini.js";

const generateEmbedding = async(text) =>{
    const response = await ai.models.embedContent({
        model: "gemini-embedding-2",
        contents: text,
        config: {
            outputDimensionality: 768
        }
    });
    return response.embeddings[0].values;
};

export { generateEmbedding };