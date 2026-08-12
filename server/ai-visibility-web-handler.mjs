function firstHeader(value) {
  return Array.isArray(value) ? value[0] : value;
}

async function requestBody(request) {
  if (request.body !== undefined && request.body !== null) {
    if (typeof request.body === "string" || request.body instanceof Uint8Array) return request.body;
    return JSON.stringify(request.body);
  }
  if (typeof request[Symbol.asyncIterator] !== "function") return undefined;
  const chunks = [];
  for await (const chunk of request) chunks.push(typeof chunk === "string" ? new TextEncoder().encode(chunk) : chunk);
  if (!chunks.length) return undefined;
  const size = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
  const joined = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    joined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return joined;
}

export async function toWebRequest(request) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers || {})) {
    const normalized = firstHeader(value);
    if (normalized !== undefined) headers.set(name, String(normalized));
  }
  const forwardedProtocol = firstHeader(request.headers?.["x-forwarded-proto"]);
  const protocol = forwardedProtocol === "http" ? "http" : "https";
  const host = firstHeader(request.headers?.["x-forwarded-host"]) || firstHeader(request.headers?.host) || "aixcelsolutions.com";
  const url = new URL(request.url || "/", `${protocol}://${host}`);
  const method = String(request.method || "GET").toUpperCase();
  const body = method === "GET" || method === "HEAD" ? undefined : await requestBody(request);
  return new Request(url, { method, headers, body });
}

export async function sendWebResponse(webResponse, response) {
  response.statusCode = webResponse.status;
  for (const [name, value] of webResponse.headers) response.setHeader(name, value);
  const body = new Uint8Array(await webResponse.arrayBuffer());
  response.end(Buffer.from(body));
}

export function createVercelHandler(webHandler, { env = process.env, fetchImpl = globalThis.fetch } = {}) {
  return async function vercelHandler(request, response) {
    const webRequest = await toWebRequest(request);
    const requestOidcToken = webRequest.headers.get("x-vercel-oidc-token");
    const runtimeEnv = requestOidcToken && !env.VERCEL_OIDC_TOKEN
      ? { ...env, VERCEL_OIDC_TOKEN: requestOidcToken }
      : env;
    return sendWebResponse(await webHandler(webRequest, runtimeEnv, fetchImpl), response);
  };
}
