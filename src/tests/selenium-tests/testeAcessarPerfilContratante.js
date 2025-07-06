import { Builder, By, until } from "selenium-webdriver";
import { loginComToken } from "./helpers/loginComToken.js";

const tokenContratante = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

export async function testeAcessarPerfilContratante() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Faz login direto na página desejada, já setando o token no sessionStorage
    await loginComToken(
      driver,
      tokenContratante,
      "http://localhost:5173/paciente"
    );
    await driver.sleep(2000);

    // Modal cadastro contratante
    try {
      const modalTitulo = await driver.wait(
        until.elementLocated(By.css(".card h4")),
        3000
      );
      const tituloTexto = await modalTitulo.getText();

      if (tituloTexto.includes("Cadastro de Contratante")) {
        console.log(
          "ℹ️ Modal de cadastro do contratante detectada. Preenchendo dados..."
        );

        const inputIdade = await driver.findElement(
          By.css('input[type="number"]')
        );
        await inputIdade.sendKeys("65");
        await driver.sleep(500);

        const inputData = await driver.findElement(
          By.css('input[type="date"]')
        );
        await inputData.sendKeys("1960-01-01");
        await driver.sleep(500);

        const textareaObs = await driver.findElement(By.css("textarea"));
        await textareaObs.sendKeys("Sem condições médicas graves.");
        await driver.sleep(500);

        const btnConfirmar = await driver.findElement(
          By.xpath("//button[contains(., 'Confirmar')]")
        );
        await btnConfirmar.click();
        await driver.sleep(2000);
      }
    } catch {
      console.log(
        "ℹ️ Modal de cadastro do contratante não foi exibida (já cadastrado)."
      );
    }

    // Acessa perfil no sidebar
    await driver.wait(
      until.elementLocated(By.css('a[href="/paciente/perfil"]')),
      10000
    );
    const linkPerfil = await driver.findElement(
      By.css('a[href="/paciente/perfil"]')
    );
    await linkPerfil.click();
    await driver.sleep(2000);

    // Valida campo nome
    await driver.wait(
      until.elementLocated(By.css('input.form-control[type="text"]')),
      10000
    );
    const inputNome = await driver.findElement(
      By.css('input.form-control[type="text"]')
    );
    const nomeValor = await inputNome.getAttribute("value");
    await driver.sleep(500);

    if (nomeValor && nomeValor.trim() !== "") {
      console.log("✅ Nome do contratante carregado:", nomeValor);
    } else {
      console.error("❌ Nome do contratante não foi carregado corretamente.");
    }

    // Valida foto perfil
    const fotoPerfil = await driver.findElement(
      By.css('img[alt="Foto de perfil"]')
    );
    const isFotoVisivel = await fotoPerfil.isDisplayed();
    await driver.sleep(500);

    if (isFotoVisivel) {
      console.log("✅ Foto do contratante exibida corretamente.");
    } else {
      console.error("❌ Foto do contratante não está visível.");
    }

    // Logout
    try {
      const btnMenuMobile = await driver.findElement(
        By.css("button.btn.btn-primary.d-md-none")
      );
      await btnMenuMobile.click();
      await driver.sleep(1000);
    } catch {}

    const btnSair = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Sair')]")),
      5000
    );
    await btnSair.click();
    await driver.sleep(1000);

    try {
      const btnConfirmarLogout = await driver.wait(
        until.elementLocated(By.css("button.btn.btn-primary")),
        5000
      );
      await btnConfirmarLogout.click();
      await driver.sleep(1000);
    } catch {}

    await driver.wait(until.urlContains("/login"), 10000);
    await driver.sleep(2000);

    console.log(
      "✅ Logout realizado com sucesso após acessar perfil contratante."
    );

    await driver.sleep(3000);
  } catch (error) {
    console.error(
      "❌ Teste de acesso ao perfil do contratante falhou:",
      error.message
    );
  } finally {
    await driver.quit();
  }
}
