import { Builder, By, until } from "selenium-webdriver";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function testeCadastroCuidador() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get("http://localhost:5173/cadastro");
    await delay(2000);

    // Aguarda os inputs carregarem
    await driver.wait(
      until.elementLocated(By.css('input[placeholder="Digite seu nome"]')),
      10000
    );

    // Preenche o formulário com delay entre inputs
    await driver
      .findElement(By.css('input[placeholder="Digite seu nome"]'))
      .sendKeys("Teste C");
    await delay(500);

    await driver
      .findElement(By.css('input[placeholder="Digite seu CPF"]'))
      .sendKeys("987.654.321-09");
    await delay(500);

    await driver
      .findElement(By.css('input[placeholder="Digite seu endereço"]'))
      .sendKeys("Rua das Flores, 123");
    await delay(500);

    await driver
      .findElement(By.css('input[placeholder="Digite seu telefone"]'))
      .sendKeys("(11)91234-5678");
    await delay(500);

    await driver
      .findElement(By.css('input[placeholder="Digite seu e-mail"]'))
      .sendKeys("testec@mail.com");
    await delay(500);

    await driver
      .findElement(By.css('input[placeholder="Digite sua senha"]'))
      .sendKeys("senha123");
    await delay(500);

    // Seleciona tipo de usuário
    const select = await driver.findElement(By.css("select"));
    await select.click();
    await delay(500);
    await driver.findElement(By.css("select option[value='Cuidador']")).click();
    await delay(500);

    // Submete o formulário
    const submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );
    await submitButton.click();
    await delay(1000);

    // Aguarda o alerta de sucesso
    const alerta = await driver.wait(
      until.elementLocated(By.css(".alert-success")),
      10000
    );
    const textoAlerta = await alerta.getText();

    if (textoAlerta.includes("Cadastro realizado com sucesso")) {
      console.log("✅ Teste de cadastro passou!");
    } else {
      console.error(
        "❌ Teste de cadastro falhou: alerta inesperado ->",
        textoAlerta
      );
    }

    // Delay para visualizar o resultado antes de fechar o navegador
    await delay(5000);
  } catch (error) {
    console.error("❌ Teste de cadastro falhou:", error);
  } finally {
    await driver.quit();
  }
}
