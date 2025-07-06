import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

import { testeCadastroCuidador } from "./testeCadastroCuidador.js";
import { testeCadastroContratante } from "./testeCadastroContratante.js";
import { testeLoginContratante } from "./testeLoginContratante.js";
import { testeAcessarPerfilContratante } from "./testeAcessarPerfilContratante.js";
import { testeLoginCuidador } from "./testeLoginCuidador.js";
import { testeAcessarPerfilCuidador } from "./testeAcessarPerfilCuidador.js";
import { testeAgendamentoContratante } from "./testeAgendamentoContratante.js";
import { testeAgendamentoCuidador } from "./testeAgendamentoCuidador.js";

// 👉 Configuração global do Chrome na metade direita da tela
function createDriver() {
  const larguraTela = 1920; // ajuste se sua tela for diferente!
  const alturaTela = 1080;
  const larguraJanela = Math.floor(larguraTela / 2);
  const posX = larguraJanela;
  const posY = 0;

  const options = new chrome.Options()
    .windowSize({ width: larguraJanela, height: alturaTela })
    .windowPosition(posX, posY);

  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function runAllTests() {
  try {
    console.log("1️⃣ Teste cadastro cuidador");
    await testeCadastroCuidador(createDriver);

    console.log("2️⃣ Teste cadastro contratante");
    await testeCadastroContratante(createDriver);

    console.log("3️⃣ Teste login contratante");
    await testeLoginContratante(createDriver);

    console.log("4️⃣ Teste acessar perfil contratante com logout");
    await testeAcessarPerfilContratante(createDriver);

    console.log("5️⃣ Teste login cuidador");
    await testeLoginCuidador(createDriver);

    console.log("6️⃣ Teste acessar perfil cuidador com logout");
    await testeAcessarPerfilCuidador(createDriver);

    console.log("7️⃣ Teste agendamento contratante com logout");
    await testeAgendamentoContratante(createDriver);

    console.log("8️⃣ Teste agendamento cuidador");
    await testeAgendamentoCuidador(createDriver);

    console.log("✅ Todos os testes concluídos com sucesso!");
  } catch (error) {
    console.error("❌ Erro na execução dos testes:", error);
  }
}

runAllTests();
