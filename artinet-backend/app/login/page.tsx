"use client";
import { Provider } from "@supabase/supabase-js";
import Link from "next/link";
import React from "react";
import { loginProvider } from "./action";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  const handleLogin = async (provider: Provider) => {
    const { error, url } = await loginProvider(provider);
    if (!error && url) router.push(url);
    else console.error(error);
  };
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-5">
      <button
        onClick={() => handleLogin("google")}
        className="w-1/4 p-2 border border-blue-900 h-10 pointer hover:border-blue-700 transition-all rounded-sm items-center justify-center text-blue-800 font-bold flex gap-5"
      >
        Iniciar sesion con Google
      </button>

      <Link href={"/"} className="font-bold">
        Regresar
      </Link>
    </main>
  );
};

export default Login;