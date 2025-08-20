'use server';

import { requireAuth } from 'lib/authMiddleware';
import { deleteFiles } from 'lib/uploadthingService';

export async function POST(req) {
  try {
    const auth = await requireAuth(req);
    if (!auth.isAuthorized) {
      return Response.json({ error: auth.message }, { status: auth.status });
    }

    const { papel } = auth.payload;

    if (!['fornecedor', 'representante'].includes(papel)) {
      return Response.json(
        {
          error: 'Apenas fornecedores ou representantes podem deletar arquivos',
        },
        { status: 403 }
      );
    }

    const { fileKey } = await req.json();

    if (!fileKey) {
      return Response.json({ error: 'fileKey inválido' }, { status: 400 });
    }

    await deleteFiles({ fileKeys: [fileKey] });

    return Response.json(
      { success: true, message: 'Arquivo deletado com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
