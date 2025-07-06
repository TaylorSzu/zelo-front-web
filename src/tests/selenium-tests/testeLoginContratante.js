import { Builder, By, until } from "selenium-webdriver";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendKeysSlowly(element, text, tempo = 200) {
  for (const char of text) {
    await element.sendKeys(char);
    await delay(tempo);
  }
}

export async function testeLoginContratante() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://localhost:5173/login");
    await delay(2000);

    // Aguarda os inputs de e-mail e senha
    await driver.wait(
      until.elementLocated(By.css('input[placeholder="Digite seu e-mail"]')),
      10000
    );

    const emailInput = await driver.findElement(
      By.css('input[placeholder="Digite seu e-mail"]')
    );
    const senhaInput = await driver.findElement(
      By.css('input[placeholder="Digite sua senha"]')
    );

    // Digita e-mail e senha lentamente
    await sendKeysSlowly(emailInput, "testep@mail.com", 200);
    await delay(500);
    await sendKeysSlowly(senhaInput, "senha123", 200);
    await delay(500);

    // Pressiona Enter para submeter
    await senhaInput.sendKeys("\n");
    await delay(1000);

    // Aguarda o título da página mudar (ajuste conforme o título real)
    await driver.wait(until.titleIs("Dashboard do Contratante"), 10000);

    // Verifica o header do dashboard
    const header = await driver.wait(
      until.elementLocated(By.css("div.card-header > h3")),
      10000
    );
    const textoHeader = await header.getText();

    if (textoHeader === "Dashboard do Contratante") {
      console.log("✅ Teste de login do contratante passou!");
    } else {
      console.error("❌ Header inesperado ->", textoHeader);
    }

    // Aguarde para visualização
    await delay(5000);
  } catch (error) {
    console.error("❌ Teste de login do contratante falhou:", error);
  } finally {
    await driver.quit();
  }
}
