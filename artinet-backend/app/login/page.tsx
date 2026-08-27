"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SubirFotoPerfil from "@/app/login/SubirFotoPerfil";

export default function CompletarPerfil() {
  const router = useRouter();
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const res = await fetch("/api/perfiles/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombres,
        apellidos,
        telefono,
        ...(foto ? { foto } : {}),
      }),
    });

    const json = await res.json();
    setEnviando(false);

    if (!json.ok) {
      setError(json.error?.message ?? "Error al guardar el perfil.");
      return;
    }

    router.push("/");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-xl font-bold">Completa tu perfil</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 w-1/3">
        <SubirFotoPerfil onFotoSubida={setFoto} />

        <input
          placeholder="Nombres"
          value={nombres}
          onChange={(e) => setNombres(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <input
          placeholder="Apellidos"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <input
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={enviando} className="border rounded p-2 font-bold w-full">
          {enviando ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </main>
  );
}