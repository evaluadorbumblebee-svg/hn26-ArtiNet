import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CAMPOS_EDITABLES = [
  "nombres",
  "apellidos",
  "telefono",
  "foto",
  "email_notificaciones",
] as const;

export async function PATCH(request: Request) {
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
          error: { code: "UNAUTHORIZED", message: "Debes iniciar sesión." },
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Filtra solo campos permitidos (nunca dejes que el cliente mande "rol" o "id")
    const datosActualizar: Record<string, unknown> = {};
    for (const campo of CAMPOS_EDITABLES) {
      if (campo in body) datosActualizar[campo] = body[campo];
    }

    if (Object.keys(datosActualizar).length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "NO_FIELDS", message: "No enviaste campos válidos." },
        },
        { status: 400 }
      );
    }

    const { data: perfil, error } = await supabase
      .from("perfiles")
      .update(datosActualizar)
      .eq("id", user.id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: { code: "UPDATE_FAILED", message: error.message } },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, data: perfil });
  } catch (error) {
    console.error("PATCH /api/perfiles/me:", error);
    return NextResponse.json(
      { ok: false, error: { code: "INTERNAL_ERROR", message: "Error interno del servidor." } },
      { status: 500 }
    );
  }
}