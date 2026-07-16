/**
 * Serviço de upload de imagens usadas na finalização de chamados.
 *
 * Hoje: usa uma URL temporária local (URL.createObjectURL) para preview e
 * mantém referências para revogação quando não forem mais utilizadas.
 *
 * Amanhã: substituir apenas o corpo de `uploadFinalizationImage` pela chamada
 * multipart/form-data ao endpoint definitivo — o restante do editor não muda.
 */

export const ALLOWED_IMAGE_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
]);

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

export type UploadResult = {
  /** URL utilizável no atributo src do <img>. */
  url: string;
  /** Nome do arquivo enviado, quando disponível. */
  filename?: string;
  /** Se true, indica que a URL é temporária (blob:) e deve ser revogada. */
  isTemporary: boolean;
};

const temporaryUrls = new Set<string>();

export function validateImageFile(file: File): string | null {
  const mime = file.type?.toLowerCase() ?? "";
  if (!ALLOWED_IMAGE_MIME.has(mime)) {
    return "Formato inválido. Envie PNG, JPG, WebP ou GIF.";
  }
  if (mime === "image/svg+xml") {
    return "Arquivos SVG não são permitidos.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Arquivo excede o limite de 10 MB.";
  }
  return null;
}

/**
 * Faz upload da imagem para o backend de finalização.
 * Enquanto o endpoint definitivo não existir, gera uma URL temporária local.
 */
export async function uploadFinalizationImage(file: File): Promise<UploadResult> {
  const error = validateImageFile(file);
  if (error) throw new Error(error);

  // TODO: substituir por fetch multipart/form-data para o endpoint real.
  // Exemplo futuro:
  // const form = new FormData();
  // form.append("file", file);
  // const res = await fetch("/api/finalization/images", { method: "POST", body: form });
  // if (!res.ok) throw new Error("Falha no upload");
  // const { url } = await res.json();
  // return { url, filename: file.name, isTemporary: false };

  const url = URL.createObjectURL(file);
  temporaryUrls.add(url);
  return { url, filename: file.name, isTemporary: true };
}

/** Revoga uma URL temporária criada por uploadFinalizationImage. */
export function revokeFinalizationImage(url: string) {
  if (temporaryUrls.has(url)) {
    URL.revokeObjectURL(url);
    temporaryUrls.delete(url);
  }
}

/** Revoga URLs temporárias que não aparecem mais em um HTML final. */
export function revokeUnusedFinalizationImages(html: string) {
  for (const url of Array.from(temporaryUrls)) {
    if (!html.includes(url)) {
      URL.revokeObjectURL(url);
      temporaryUrls.delete(url);
    }
  }
}
