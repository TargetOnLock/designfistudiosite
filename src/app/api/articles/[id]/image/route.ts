import { NextRequest, NextResponse } from "next/server";
import { getArticleById } from "@/lib/articles-data";

/**
 * API endpoint to serve article images for Open Graph and social sharing
 * This is needed because base64 images in data URLs don't work well for social media previews
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await getArticleById(id);

    if (!article || !article.image) {
      // Return a default image or 404
      return NextResponse.redirect(new URL("/favicon.png", request.url));
    }

    // If image is base64, decode and serve it
    if (article.image.startsWith("data:image")) {
      // Extract the base64 data and content type
      const matches = article.image.match(/^data:image\/(\w+);base64,(.+)$/);
      if (matches) {
        const contentType = matches[1];
        const base64Data = matches[2];
        const imageBuffer = Buffer.from(base64Data, "base64");

        return new NextResponse(imageBuffer, {
          headers: {
            "Content-Type": `image/${contentType}`,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }

    // Handle raw base64 (without data URL prefix)
    if (!article.image.startsWith("http://") && !article.image.startsWith("https://") && !article.image.startsWith("data:")) {
      try {
        // Try to decode as base64
        const base64Data = article.image.includes(",") 
          ? article.image.split(",")[1] 
          : article.image;
        const imageBuffer = Buffer.from(base64Data, "base64");
        
        // Detect image type from buffer (simple check)
        const isPng = imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50;
        const isJpeg = imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8;
        const isWebP = imageBuffer.slice(0, 4).toString() === "RIFF" && 
                       imageBuffer.slice(8, 12).toString() === "WEBP";
        
        let contentType = "image/jpeg"; // default
        if (isPng) contentType = "image/png";
        else if (isJpeg) contentType = "image/jpeg";
        else if (isWebP) contentType = "image/webp";

        return new NextResponse(imageBuffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } catch (error) {
        console.error("Error decoding base64 image:", error);
        // Fall through to redirect
      }
    }

    // If it's already a URL, redirect to it
    if (article.image.startsWith("http://") || article.image.startsWith("https://")) {
      return NextResponse.redirect(article.image);
    }

    // Fallback to favicon
    return NextResponse.redirect(new URL("/favicon.png", request.url));
  } catch (error) {
    console.error("Error serving article image:", error);
    return NextResponse.redirect(new URL("/favicon.png", request.url));
  }
}

