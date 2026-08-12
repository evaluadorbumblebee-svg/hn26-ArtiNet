"use server";

import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";

export async function loginProvider(provider: Provider) {
  try {
    const supabase = await createClient();

    console.log(process.env.NEXT_PUBLIC_BASE_URL);

    const { error, data } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/v1/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) throw error;

    return { error: null, url: data.url };
  } catch (error) {
    return {
      error: "Error in login provider",
      url: null,
    };
  }
}