import { conexao } from "../config/conexao.js";

export async function consistencia() {
  const pool = await conexao();
  try {
    await pool.query(`
      INSERT INTO clientes (nome, email, idade)
      VALUES ('João', 'joao@email.com', 30);
    `);
    // Tentando inserir outro cliente com mesmo email
    await pool.query(`
      INSERT INTO clientes (nome, email, idade)
      VALUES ('Maria', 'joao@email.com', 25);
    `);
  } catch (error) {
    console.log('Erro de consistência:', error.message);
    await pool.end();
  }
}