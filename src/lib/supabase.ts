const restHeaders = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase is not configured");
  }

  return {
    url,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  };
};

async function readError(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as { message?: string; error?: string };
    return body.message || body.error || fallback;
  } catch {
    return fallback;
  }
}

export async function supabaseRest<T>(
  path: string,
  init: RequestInit & { search?: string } = {},
): Promise<T> {
  const { url, headers } = restHeaders();
  const { search, ...request } = init;
  const response = await fetch(`${url}/rest/v1/${path}${search ?? ""}`, {
    ...request,
    headers: {
      ...headers,
      "Content-Type": "application/json",
      ...(request.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Supabase request failed."));
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

export async function supabaseUpload(path: string, file: File) {
  const { url, headers } = restHeaders();
  const response = await fetch(`${url}/storage/v1/object/cv-guestbook/${path}`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": file.type,
      "x-upsert": "false",
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Could not upload the image."));
  }

  return `${url}/storage/v1/object/public/cv-guestbook/${path}`;
}
