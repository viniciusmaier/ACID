import { conexao } from "../config/conexao.js";

export async function durabilidade() {
  const pool = await conexao();

  try {

    await pool.query('BEGIN');
    await pool.query(`INSERT INTO clientes (nome, email, idade) VALUES ('Carlos', 'carlos1@email.com', 40)`);
    await pool.query('COMMIT');
    console.log('Dados gravados com commit.');

    const dadosGerados = await pool.query(`
        SELECT *FROM clientes WHERE nome = 'Carlos';
      `)

    console.log(dadosGerados.rows[0]);
    // Mesmo que o servidor caia agora, o dado estará salvo.

  } catch (error) {
    
    await pool.query('ROLLBACK');
    console.log('Erro:', error.message);
    await pool.end();
  }
}