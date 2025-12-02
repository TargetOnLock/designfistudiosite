import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createHash } from "crypto";

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

// Helper function to hash password
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

// DELETE - Delete an article by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify admin authentication via email and password hash in headers
    const adminEmail = request.headers.get("x-admin-email");
    const adminPasswordHash = request.headers.get("x-admin-password-hash");
    const expectedAdminEmail = process.env.ADMIN_EMAIL;
    const expectedAdminPassword = process.env.ADMIN_PASSWORD;

    if (!expectedAdminEmail || !expectedAdminPassword) {
      return NextResponse.json(
        { error: "Admin credentials not configured" },
        { status: 500 }
      );
    }

    // Verify email
    if (!adminEmail || adminEmail.toLowerCase() !== expectedAdminEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify password hash
    const expectedPasswordHash = hashPassword(expectedAdminPassword);
    if (!adminPasswordHash || adminPasswordHash !== expectedPasswordHash) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // If Supabase is configured, delete from database
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting article:", error);
        return NextResponse.json(
          { error: "Failed to delete article", details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: "Article deleted successfully" },
        { status: 200 }
      );
    } else {
      // Fallback: return error if Supabase not configured
      return NextResponse.json(
        { error: "Database not configured. Cannot delete article." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting article:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to delete article", details: errorMessage },
      { status: 500 }
    );
  }
}

