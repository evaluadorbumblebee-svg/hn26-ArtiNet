"use server";

import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";

export async function loginProvider(provider: Provider) {
  try {
    const supabase = await createClient();

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const redirectTo = `${baseUrl}/auth/callback`;

    console.log("Redirect URL:", redirectTo);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error("Supabase OAuth error:", error.message);

      return {
        error: error.message,
        url: null,
      };
    }

    return {
      error: null,
      url: data.url,
    };
  } catch (error) {
    console.error("Login provider error:", error);

    return {
      error: "Error en el inicio de sesión",
      url: null,
    };
  }
}