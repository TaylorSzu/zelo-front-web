import { Builder, By, until } from "selenium-webdriver";

async function digitarComDelay(element, texto, delay = 300) {
  for (const char of texto) {
    await element.sendKeys(char);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

export async function testeRedefinirSenha() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get(
      "http://localhost:5173/redefinirSenha?token=meu-token-de-teste"
    );

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

    await digitarComDelay(novaSenhaInput, "senhaNova123", 300);
    await driver.sleep(500);
    await digitarComDelay(confirmarSenhaInput, "senhaNova123", 300);
    await driver.sleep(500);

    const btnSubmit = await driver.findElement(By.css('button[type="submit"]'));
    await btnSubmit.click();

    await driver.wait(until.elementLocated(By.css(".alert-success")), 10000);

    const alerta = await driver.findElement(By.css(".alert-success"));
    const textoAlerta = await alerta.getText();

    if (textoAlerta.includes("Senha redefinida com sucesso")) {
      console.log("✅ Senha redefinida com sucesso!");
    } else {
      console.error("❌ Alerta inesperado ->", textoAlerta);
    }

    await driver.sleep(3000);
    await driver.wait(
      until.elementLocated(By.css('input[placeholder="Digite seu e-mail"]')),
      10000
    );

    console.log("✅ Redirecionamento para login confirmado!");

    await driver.sleep(10000);
  } catch (err) {
    console.error("❌ Teste de redefinição de senha falhou:", err);
  } finally {
    await driver.quit();
  }
}
