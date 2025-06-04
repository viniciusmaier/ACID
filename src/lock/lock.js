import { conexao } from "../config/conexao.js";

export async function lock() { 
    transacao1();
    transacao2();    
}
    
async function transacao1() {
  const pool = await conexao();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    console.log('[T1] Bloqueando a cliente 1...');
    await client.query('SELECT * FROM clientes WHERE id = 1 FOR UPDATE');
    console.log('[T1] Conta 1 bloqueada. Esperando...');
    await new Promise(resolve => setTimeout(resolve, 10000)); // Espera 10s
    await client.query('COMMIT');
    console.log('[T1] Commit realizado.');
    console.log('[T1] Finalizando transação.');
    await client.query('END');
  } catch (e) {
    console.error('[T1] Erro:', e.message);
    await client.query('ROLLBACK');
  } finally {
    console.log('[T1] Liberando conexão.');
    client.release();
  }
}

async function transacao2() {
  const pool = await conexao();
  const client = await pool.connect();

  try {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Espera T1 bloquear primeiro
    await client.query('BEGIN');
    console.log('[T2] Tentando acessar cliente 1...');
    await client.query('SELECT * FROM clientes WHERE id = 1 FOR UPDATE');
    console.log('[T2] Conseguiu o lock e continua...');
    await client.query('COMMIT');
    console.log('[T2] Commit realizado.');
    console.log('[T1] Finalizando transação.');
  } catch (e) {
    console.error('[T2] Erro:', e.message);
    await client.query('ROLLBACK');
  } finally {
    console.log('[T2] Liberando conexão.');
    client.release();
  }
}
