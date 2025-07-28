export async function POST() {
  // Apenas responde sucesso. O frontend deve apagar o token.
  return Response.json(
    { message: 'Sessão encerrada com sucesso' },
    { status: 200 }
  );
}
