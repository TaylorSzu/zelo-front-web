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

export async function testeLoginCuidador() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://localhost:5173/login");
    await delay(2000);

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

    await sendKeysSlowly(emailInput, "testec@mail.com", 200);
    await delay(500);
    await sendKeysSlowly(senhaInput, "senha123", 200);
    await delay(500);

    await senhaInput.sendKeys("\n");
    await delay(1000);

    await driver.wait(until.titleIs("Dashboard do Cuidador"), 10000);

    const header = await driver.wait(
      until.elementLocated(By.css("div.card-header > h3")),
      10000
    );
    const textoHeader = await header.getText();

    if (textoHeader === "Dashboard do Cuidador") {
      console.log("✅ Teste de login do cuidador passou!");
    } else {
      console.error(
        "❌ Teste de login do cuidador falhou: Header inesperado ->",
        textoHeader
      );
    }

    await delay(5000);
  } catch (error) {
    console.error("❌ Teste de login do cuidador falhou:", error);
  } finally {
    await driver.quit();
  }
}
