import { testeRecuperarSenha } from "./recuperarSenha.js";
import { testeRedefinirSenha } from "./redefinirSenha.js";

async function runRecuperarTests() {
  console.log("Iniciando teste: Recuperar Senha");
  await testeRecuperarSenha();

  console.log("Iniciando teste: Redefinir Senha");
  await testeRedefinirSenha();

  console.log("Todos os testes de recuperação foram executados.");
}

runRecuperarTests().catch((err) => {
  console.error("Erro geral nos testes de recuperação:", err);
});
