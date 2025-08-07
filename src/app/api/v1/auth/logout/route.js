export async function POST() {
  return new Response(
    JSON.stringify({ message: 'Sessão encerrada com sucesso' }),
    {
      status: 200,
      headers: {
        'Set-Cookie': `token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
        'Content-Type': 'application/json',
      },
    }
  );
}
