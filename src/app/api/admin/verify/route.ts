import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const expectedAdminEmail = process.env.ADMIN_EMAIL;

    if (!expectedAdminEmail) {
      return NextResponse.json(
        { error: "Admin email not configured" },
        { status: 500 }
      );
    }

    if (email.toLowerCase() === expectedAdminEmail.toLowerCase()) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error verifying admin email:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}

