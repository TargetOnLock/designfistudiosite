import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const RESUME_FILENAME = "Blaine-Powers-SEO-Resume.docx";
const CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/**
 * Serves the resume file as a download.
 * File must be at: public/resume/Blaine-Powers-SEO-Resume.docx
 * Using an API route keeps the file URL non-obvious and allows future protection (e.g. rate limit or optional auth).
 */
export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "resume",
      RESUME_FILENAME
    );
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": CONTENT_TYPE,
        "Content-Disposition": `attachment; filename="${RESUME_FILENAME}"`,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (err) {
    console.error("Resume file not found or unreadable:", err);
    return NextResponse.json(
      { error: "Resume not available" },
      { status: 404 }
    );
  }
}
