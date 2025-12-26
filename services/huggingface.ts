import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HF_TOKEN!);

export async function classifyImage(imageFile: File) {
    try {
        const output = await client.imageClassification({
            data: imageFile,
            model: "julien-c/hotdog-not-hotdog",
        });

        return output;
    } catch (error: any) {
        console.error("hugging face error:", error.message);
        throw new Error("something went wrong");
    }
}