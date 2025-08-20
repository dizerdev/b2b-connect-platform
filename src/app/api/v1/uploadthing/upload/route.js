'use server';
import { requireAuth } from 'lib/authMiddleware';
import { prepareUpload } from 'lib/uploadthingService';

export async function POST(req) {
  const auth = await requireAuth(req);
  if (!auth.isAuthorized) {
    return Response.json({ error: auth.message }, { status: auth.status });
  }

  const { papel } = auth.payload;

  if (!['fornecedor', 'representante'].includes(papel)) {
    return Response.json(
      { error: 'Apenas fornecedores ou representantes podem enviar arquivos' },
      { status: 403 }
    );
  }

  try {
    const { files, callbackUrl, callbackSlug } = await req.json();

    if (!files || !Array.isArray(files) || files.length === 0) {
      return Response.json(
        { error: 'Nenhum arquivo informado' },
        { status: 400 }
      );
    }

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
