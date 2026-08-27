"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  onFotoSubida: (url: string) => void;
  fotoActual?: string | null;
}

export default function SubirFotoPerfil({ onFotoSubida, fotoActual }: Props) {
  const supabase = createClient();
  const [preview, setPreview] = useState<string | null>(fotoActual ?? null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    const tiposValidos = ["image/jpeg", "image/png", "image/webp"];
    if (!tiposValidos.includes(archivo.type)) {
      setError("Solo se permiten imágenes JPG, PNG o WEBP.");
      return;
    }
    if (archivo.size > 5 * 1024 * 1024) {
      setError("La imagen no puede pesar más de 5MB.");
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(archivo));
    setSubiendo(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Sesión no válida.");

      const extension = archivo.name.split(".").pop();
      const ruta = `${user.id}/foto.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(ruta, archivo, { upsert: true, cacheControl: "3600" });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(ruta);

      onFotoSubida(`${publicUrlData.publicUrl}?t=${Date.now()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la foto.");
      setPreview(fotoActual ?? null);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Foto de perfil" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-xs">Sin foto</span>
        )}
      </div>

      <label className="text-sm font-bold cursor-pointer text-blue-700">
        {subiendo ? "Subiendo..." : "Elegir foto"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleArchivo}
          disabled={subiendo}
          className="hidden"
        />
      </label>

      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  );
}