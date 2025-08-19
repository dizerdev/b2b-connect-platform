import {
  prepareUpload,
  pollUpload,
  setServerCallback,
} from 'lib/uploadthingService';

export async function POST(req) {
  try {
    const { files, callbackUrl, callbackSlug } = await req.json();

    // 1. Solicita presigned URLs
    const uploadUrls = await prepareUpload({
      files,
      callbackUrl,
      callbackSlug,
      routeConfig: ['image'], // ou outro tipo de rota
    });

    return new Response(JSON.stringify({ uploadUrls }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
