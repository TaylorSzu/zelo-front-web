import { Builder, By, until } from "selenium-webdriver";

async function digitarComDelay(element, texto, delay = 300) {
  for (let char of texto) {
    await element.sendKeys(char);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

(async function testeRedefinirSenha() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    // Simula o acesso com token na URL
    await driver.get(
      "http://localhost:5173/redefinirSenha?token=meu-token-de-teste"
    );

    // Aguarda o campo da nova senha
    await driver.wait(
      until.elementLocated(By.css('input[placeholder="Digite a nova senha"]')),
      10000
    );

    const novaSenhaInput = await driver.findElement(
      By.css('input[placeholder="Digite a nova senha"]')
    );
    const confirmarSenhaInput = await driver.findElement(
      By.css('input[placeholder="Confirme a nova senha"]')
    );

    // Digita a nova senha com delay por caractere
    await digitarComDelay(novaSenhaInput, "senhaNova123", 300);
    await driver.sleep(500);
    await digitarComDelay(confirmarSenhaInput, "senhaNova123", 300);
    await driver.sleep(500);

    // Clica no botão de redefinir senha
    const btnSubmit = await driver.findElement(By.css('button[type="submit"]'));
    await btnSubmit.click();

    // Aguarda mensagem de sucesso
    await driver.wait(until.elementLocated(By.css(".alert-success")), 10000);

    const alerta = await driver.findElement(By.css(".alert-success"));
    const textoAlerta = await alerta.getText();

    if (textoAlerta.includes("Senha redefinida com sucesso")) {
      console.log("✅ Senha redefinida com sucesso!");
    } else {
      console.error("❌ Alerta inesperado ->", textoAlerta);
    }

    // Aguarda redirecionamento ao login (tempo extra para visualização)
    await driver.sleep(3000);
    await driver.wait(
      until.elementLocated(By.css('input[placeholder="Digite seu e-mail"]')),
      10000
    );

    console.log("✅ Redirecionamento para login confirmado!");

    // Mais tempo para visualizar a tela final
    await driver.sleep(10000);
  } catch (err) {
    console.error("❌ Teste de redefinição de senha falhou:", err);
  } finally {
    await driver.quit();
  }
})();
