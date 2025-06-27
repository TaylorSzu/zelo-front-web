import { Builder, By, until } from "selenium-webdriver";

const tokenCuidador = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

export async function testeAcessarPerfilCuidador() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Acesse uma página inicial antes de setar o token
    await driver.get("http://localhost:5173/");
    await driver.executeScript(
      `window.sessionStorage.setItem('token', '${tokenCuidador}');`
    );
    await driver.navigate().refresh();
    await driver.sleep(1000);

    // Agora navegue até o dashboard do cuidador
    await driver.get("http://localhost:5173/cuidador");
    await driver.sleep(2000);

    // Modal de cadastro
    try {
      const modalCadastro = await driver.wait(
        until.elementLocated(By.css(".card h4")),
        3000
      );
      const tituloModal = await modalCadastro.getText();

      if (tituloModal.includes("Cadastro de Cuidador")) {
        console.log("ℹ️ Modal de cadastro detectada. Preenchendo dados...");

        const inputDisp = await driver.findElement(
          By.css('input[placeholder*="08:00"]')
        );
        await inputDisp.sendKeys("Segunda a Sexta, 08:00 - 18:00");
        await driver.sleep(500);

        const inputValor = await driver.findElement(
          By.css('input[placeholder*="diária"]')
        );
        await inputValor.sendKeys("200");
        await driver.sleep(500);

        const textareaEsp = await driver.findElement(By.css("textarea"));
        await textareaEsp.sendKeys("Cuidados paliativos");
        await driver.sleep(500);

        const btnConfirmar = await driver.findElement(
          By.xpath("//button[contains(., 'Confirmar')]")
        );
        await btnConfirmar.click();
        await driver.sleep(2000);
      }
    } catch {
      console.log("ℹ️ Modal de cadastro não foi exibida (já cadastrado).");
    }

    // Acessa perfil no sidebar
    await driver.wait(
      until.elementLocated(By.css('a[href="/cuidador/perfil"]')),
      10000
    );
    const linkPerfil = await driver.findElement(
      By.css('a[href="/cuidador/perfil"]')
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
      console.log("✅ Nome do cuidador carregado:", nomeValor);
    } else {
      console.error("❌ Nome do cuidador não foi carregado corretamente.");
    }

    // Valida foto perfil
    const fotoPerfil = await driver.findElement(
      By.css('img[alt="Foto de perfil"]')
    );
    const isFotoVisivel = await fotoPerfil.isDisplayed();
    await driver.sleep(500);

    if (isFotoVisivel) {
      console.log("✅ Foto do cuidador exibida corretamente.");
    } else {
      console.error("❌ Foto do cuidador não está visível.");
    }

    // Logout
    try {
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
        "✅ Logout realizado com sucesso após acessar perfil cuidador."
      );
    } catch (logoutError) {
      console.warn("⚠️ Logout não foi possível:", logoutError.message);
    }

    await driver.sleep(3000);
  } catch (error) {
    console.error(
      "❌ Teste de acesso ao perfil do cuidador falhou:",
      error.message
    );
  } finally {
    await driver.quit();
  }
}
