import { conexao } from "../config/conexao.js";

export async function atomicidade() {
  const pool = await conexao();
  const client = await pool.connect();
    
  try {
    await client.query('BEGIN');

    // Simulando debitar "10" de um cliente (ex: idade)
    await client.query('UPDATE clientes SET idade = idade - 10 WHERE id = $1', [1]);

    // Simulando creditar "10" para outro cliente
    await client.query('UPDATE clientes SET idade = idade + 10 WHERE id = $1', [2]);

    // Comitando as duas operações juntas
    await client.query('COMMIT');
    console.log('Transação concluída com sucesso!');

    // ADICIONANDO UM ERRO 
    throw new Error();
  } catch (e) {
    await client.query('ROLLBACK');
    console.log('Erro ocorrido, transação revertida:', e.message);
  } finally {
    client.release();
    await pool.end();
  }
}
