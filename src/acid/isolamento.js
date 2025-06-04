
/* 3 TIPOS DE ISOLAMENTO 

 Read Committed (padrão)

 Repeatable Read

 Serializable (mais restritivo)
 
*/

import { conexao } from "../config/conexao.js";

export async function isolamento() {
  const pool = await conexao();

  const client1 = await pool.connect();
  const client2 = await pool.connect();

  try {
    await client1.query('BEGIN ISOLATION LEVEL SERIALIZABLE');
    await client2.query('BEGIN ISOLATION LEVEL SERIALIZABLE');


    // Transação 1 lê o cliente
    const res1 = await client1.query('SELECT idade FROM clientes WHERE id = 1');
    console.log('Cliente idade (client1):', res1.rows[0].idade);

    // Transação 2 atualiza a idade do cliente
    await client2.query('UPDATE clientes SET idade = idade + 1 WHERE id = 1');
    await client2.query('COMMIT');
    const resp2 = await client2.query('SELECT idade FROM clientes WHERE id = 1');
    console.log('Transação 2 comitada.');
    console.log("Alteração feita: [ campo: 'idade'; valor: " + resp2.rows[0].idade +" ]");

    // Transação 1 tenta atualizar com base na idade antiga
    await client1.query('UPDATE clientes SET idade = $1 WHERE id = 1', [res1.rows[0].idade + 1]);
    await client1.query('COMMIT');
    console.log('Transação 1 comitada.');
  } catch (error) {
    await client1.query('ROLLBACK');
    await client2.query('ROLLBACK');
    console.log('Erro de isolamento:', error.message);
  } finally {

    /*
      DEVOLVE A CONEXÃO PARA O "BALDE"
      OBS ::. SE CASO NÃO FOR DEVOLVIDA A CONEXÃO PODERÁ OCASIONAR TRAVAMENTOS,
              LENTIDÃO OU QUEDAS DE APLICAÇÃO POR ESGOTAMENTO DE RECURSO.
    */

    client1.release();
    client2.release();

    //EXPLODE O BALDE
    await pool.end();
  }
}