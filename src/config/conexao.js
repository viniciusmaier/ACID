import { Pool } from 'pg';

export async function conexao() { 
    const pool = new Pool({
      user: 'admin',
      password: 'admin',
      host: '127.0.0.1',
      database: 'teste',
      port: 5432,
    });

    return await pool;
}



export async function createTable() {
    const c = await conexao();

     const sql = `
        CREATE TABLE IF NOT EXISTS clientes (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            idade INT,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`

    await c.query(sql);
}


export async function popularClientes() {
  const pool = await conexao();

  const clientes = [
    { nome: 'Ana Silva', email: 'ana.silva@email.com', idade: 28 },
    { nome: 'Bruno Costa', email: 'bruno.costa@email.com', idade: 35 },
    { nome: 'Carla Dias', email: 'carla.dias@email.com', idade: 22 },
    { nome: 'Daniel Almeida', email: 'daniel.almeida@email.com', idade: 40 },
    { nome: 'Eva Souza', email: 'eva.souza@email.com', idade: 31 },
  ];

  try {
    for (const cliente of clientes) {
      const query = `
        INSERT INTO clientes (nome, email, idade)
        VALUES ($1, $2, $3)
        ON CONFLICT (email) DO NOTHING
      `;
      await pool.query(query, [cliente.nome, cliente.email, cliente.idade]);
      console.log(`Cliente ${cliente.nome} inserido ou já existente.`);
    }
  } catch (error) {
    return null
  } finally {
    await pool.end();
  }
}
