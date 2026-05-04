// app/api/upload-submitted-recipe-image/route.ts

import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const file = formData.get("file");

		if (!file || !(file instanceof File)) {
		return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
		}

		if (!file.type.startsWith("image/")) {
		return NextResponse.json({ error: "File must be an image." }, { status: 400 });
		}

		const maxSize = 5 * 1024 * 1024;

		if (file.size > maxSize) {
		return NextResponse.json(
			{ error: "Image must be smaller than 5MB." },
			{ status: 400 }
		);
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(
			{
				resource_type: "image",
				folder: "submitted-recipes",
			},
			(error, result) => {
				if (error) return reject(error);
				resolve(result as UploadApiResponse);
			}
			)
			.end(buffer);
		});

		return NextResponse.json({
		success: true,
		url: uploadResult.secure_url,
		public_id: uploadResult.public_id,
		});
	} catch (error) {
		console.error("Submitted recipe image upload error:", error);
		return NextResponse.json(
		{ error: "Image upload failed." },
		{ status: 500 }
		);
	}
}