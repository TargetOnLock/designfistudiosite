import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

// Helper function to hash password
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const expectedAdminEmail = process.env.ADMIN_EMAIL;
    const expectedAdminPassword = process.env.ADMIN_PASSWORD;

    if (!expectedAdminEmail || !expectedAdminPassword) {
      return NextResponse.json(
        { error: "Admin credentials not configured" },
        { status: 500 }
      );
    }

    // Verify email
    if (email.toLowerCase() !== expectedAdminEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const hashedPassword = hashPassword(password);
    const expectedPasswordHash = hashPassword(expectedAdminPassword);

    if (hashedPassword !== expectedPasswordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Return success with password hash for subsequent requests
    return NextResponse.json({ 
      success: true,
      passwordHash: hashedPassword, // Return hash for client to use in subsequent requests
    });
  } catch (error) {
    console.error("Error verifying admin credentials:", error);
    return NextResponse.json(
      { error: "Failed to verify credentials" },
      { status: 500 }
    );
  }
}

