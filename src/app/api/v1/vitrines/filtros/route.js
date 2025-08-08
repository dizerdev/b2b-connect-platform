export async function GET() {
  const CONTINENTES = ['América', 'Europa', 'Ásia'];
  const PAISES = ['Brasil', 'Argentina', 'Itália', 'França'];
  const CATEGORIAS = ['Moda Masculina', 'Moda Feminina', 'Fitness'];
  const ESPECIFICACOES = ['Algodão orgânico', 'Tecido técnico', 'Estampado'];

  return Response.json({
    continentes: CONTINENTES,
    paises: PAISES,
    categorias: CATEGORIAS,
    especificacoes: ESPECIFICACOES,
  });
}
