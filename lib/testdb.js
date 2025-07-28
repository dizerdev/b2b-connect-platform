import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function TestQuery() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const usuarios = await client.query(`SELECT * FROM usuarios`);
    await client.query('COMMIT');
    console.log(usuarios.rows);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar tabelas ou inserir dados seed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

TestQuery();
