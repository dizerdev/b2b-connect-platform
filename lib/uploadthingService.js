// lib/uploadthingService.js

const API_BASE = 'https://api.uploadthing.com/v6';
const API_KEY = process.env.UPLOADTHING_SECRET;

/**
 * Prepare upload - solicita URLs pré-assinadas
 */
export async function prepareUpload({
  callbackUrl,
  callbackSlug,
  files,
  routeConfig = ['image'],
  metadata = null,
}) {
  const res = await fetch(`${API_BASE}/prepareUpload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Uploadthing-Api-Key': API_KEY,
      'X-Uploadthing-Version': '6.4.0',
      'X-Uploadthing-FE-Package': '@your/frontend', // altere se quiser
      'X-Uploadthing-BE-Adapter': 'nextjs',
    },
    body: JSON.stringify({
      callbackUrl,
      callbackSlug,
      files,
      routeConfig,
      metadata,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`prepareUpload error: ${err}`);
  }

  return res.json();
}

/**
 * Upload files sem file routes
 */
export async function uploadFiles({
  files,
  acl = 'public-read',
  metadata = null,
  contentDisposition = 'inline',
}) {
  const res = await fetch(`${API_BASE}/uploadFiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Uploadthing-Api-Key': API_KEY,
      'X-Uploadthing-Version': '6.4.0',
      'X-Uploadthing-FE-Package': '@your/frontend',
      'X-Uploadthing-BE-Adapter': 'nextjs',
    },
    body: JSON.stringify({ files, acl, metadata, contentDisposition }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`uploadFiles error: ${err}`);
  }

  return res.json();
}

/**
 * Poll para saber se upload foi concluído
 */
export async function pollUpload(fileKey) {
  const res = await fetch(`${API_BASE}/pollUpload/${fileKey}`, {
    method: 'GET',
    headers: {
      'X-Uploadthing-Api-Key': API_KEY,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`pollUpload error: ${err}`);
  }

  return res.json();
}

/**
 * Get server callback data
 */
export async function getServerCallback(authToken) {
  const res = await fetch(`${API_BASE}/serverCallback`, {
    method: 'GET',
    headers: {
      Authorization: authToken,
      'X-Uploadthing-Api-Key': API_KEY,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`getServerCallback error: ${err}`);
  }

  return res.json();
}

/**
 * Set server callback data
 */
export async function setServerCallback({ fileKey, callbackData = null }) {
  const res = await fetch(`${API_BASE}/serverCallback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Uploadthing-Api-Key': API_KEY,
      'X-Uploadthing-Version': '6.4.0',
      'X-Uploadthing-FE-Package': '@your/frontend',
      'X-Uploadthing-BE-Adapter': 'nextjs',
    },
    body: JSON.stringify({ fileKey, callbackData }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`setServerCallback error: ${err}`);
  }

  return res.json();
}
