import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

// DELETE - Delete an article by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verify admin authentication via email in headers
    const adminEmail = request.headers.get("x-admin-email");
    const expectedAdminEmail = process.env.ADMIN_EMAIL;

    if (!expectedAdminEmail) {
      return NextResponse.json(
        { error: "Admin email not configured" },
        { status: 500 }
      );
    }

    if (!adminEmail || adminEmail !== expectedAdminEmail) {
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

