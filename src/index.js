// Por que ACID é importante?
// Confiabilidade dos dados
// As propriedades ACID garantem que os dados sempre permaneçam corretos, mesmo em situações de falha ou erro. Isso evita registros incompletos ou incorretos.
// Prevenção de corrupção e perda de dados
// Se algo der errado no meio de uma operação, o banco de dados consegue desfazer tudo e voltar ao estado anterior — isso protege contra corrupção de dados.
// Suporte à concorrência e falhas
// Em sistemas com muitos usuários acessando ao mesmo tempo, o ACID garante que uma transação não interfira na outra e que tudo continue funcionando mesmo em caso de quedas ou erros.


// ACID = 4 propriedades que garantem a confiabilidade da transação:

// 1 - Atomicidade -> TRANSAÇÕES INTEGRAS (OU VAI TUDO OU NÃO VAI NADA!).

// 2 - Consistência -> OS DADOS PERMANECEM VALIDOS APÓS A TRANSAÇÃO

// 3 - Isolamento -> UMA TRANSAÇÃO NÃO INTERFERE EM OUTRA TRANSAÇÃO

// 4 - Durabilidade -> DEPOIS DE COMITADA AS ALTERAÇÕES OS DADOS NÃO SE PERDEM.

import {createTable, popularClientes} from './config/conexao.js';
import { isolamento } from './acid/isolamento.js';
import { durabilidade } from './acid/durabilidade.js';
import {consistencia} from './acid/consistencia.js';
import { atomicidade } from './acid/atomicidade.js'
import { lock } from './lock/lock.js';

export async function main() {
    await createTable();
     await popularClientes();


    // await isolamento();
    // await durabilidade();
    // await consistencia();
    // await atomicidade();
    await lock();
}


main();


