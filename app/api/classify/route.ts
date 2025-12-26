import { classifyImage } from "@/services/huggingface";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const formData = await req.formData();
        const image = formData.get("image");

        if (!image || !(image instanceof File)) {
            return NextResponse.json(
                { error: "no image" },
                { status: 400 }
            );
        }

        const result = await classifyImage(image);

        return NextResponse.json({ result });
    } catch (error: any) {
        console.error("full error", error)
        return NextResponse.json(
            {
                error: error?.message || "unknown error",
                stack: error?.stack,
            },
            { status: 500 }
        );
    }
}