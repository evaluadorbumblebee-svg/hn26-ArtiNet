import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Debes iniciar sesión.",
          },
        },
        { status: 401 }
      );
    }

    const { data: perfil, error } = await supabase
      .from("perfiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "PROFILE_NOT_FOUND",
            message: error.message,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: perfil,
    });
  } catch (error) {
    console.error("GET /api/perfiles/me:", error);

    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Error interno del servidor.",
        },
      },
      { status: 500 }
    );
  }
}