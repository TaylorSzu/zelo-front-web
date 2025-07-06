import { Builder, By, until, Key } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const tokenContratante = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // seu JWT contratante

export async function testeAgendamentoContratante() {
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options())
    .build();

  try {
    // 1️⃣ Acesse uma URL válida para injetar o token
    await driver.get("http://localhost:5173/");
    await driver.executeScript(
      `window.sessionStorage.setItem('token', '${tokenContratante}');`
    );
    await driver.navigate().refresh();
    await driver.sleep(1000);

    // 2️⃣ Vá para a página do contratante
    await driver.get("http://localhost:5173/paciente");
    await driver.sleep(2000);

    // 3️⃣ Clicar no link lateral "Encontrar cuidador" (desktop)
    const encontrarBtn = await driver.wait(
      until.elementIsVisible(
        await driver.findElement(By.linkText("Encontrar cuidador"))
      ),
      7000
    );
    await encontrarBtn.click();
    await driver.sleep(2000);

    // 4️⃣ Esperar a lista de cuidadores carregar
    await driver.wait(until.elementLocated(By.css(".card .btn-primary")), 7000);
    await driver.sleep(1000);

    // 5️⃣ Clicar no botão Agendar do primeiro cuidador
    const btnAgendar = await driver.findElement(By.css(".card .btn-primary"));
    await driver.wait(until.elementIsEnabled(btnAgendar), 5000);
    await btnAgendar.click();
    await driver.sleep(2000);

    // 6️⃣ Preencher a página de agendamento
    await driver.wait(until.elementLocated(By.css("input[type=date]")), 7000);
    const inputData = await driver.findElement(By.css("input[type=date]"));
    const hoje = new Date().toISOString().split("T")[0];

    await inputData.sendKeys(Key.chord(Key.CONTROL, "a"), Key.BACK_SPACE);
    await inputData.sendKeys(hoje);
    await driver.sleep(1000);

    const inputsTime = await driver.findElements(By.css("input[type=time]"));
    await inputsTime[0].sendKeys(Key.chord(Key.CONTROL, "a"), Key.BACK_SPACE);
    await inputsTime[0].sendKeys("09:00");
    await driver.sleep(1000);

    await inputsTime[1].sendKeys(Key.chord(Key.CONTROL, "a"), Key.BACK_SPACE);
    await inputsTime[1].sendKeys("13:00");
    await driver.sleep(1000);

    const selectTipoServico = await driver.findElement(By.css("select"));
    await selectTipoServico.click();
    await driver.sleep(500);
    await selectTipoServico.sendKeys("Para mim (Contratante)");
    await driver.sleep(1500);

    // 7️⃣ Confirmar agendamento
    const btnConfirmar = await driver.findElement(
      By.css("button[type=submit]")
    );
    await driver.wait(until.elementIsEnabled(btnConfirmar), 5000);
    await btnConfirmar.click();
    await driver.sleep(3000);

    // 8️⃣ Validar mensagem de sucesso
    const alert = await driver.wait(
      until.elementLocated(By.css(".alert-success")),
      7000
    );
    const textoAlerta = await alert.getText();

    if (textoAlerta.toLowerCase().includes("sucesso")) {
      console.log("✅ Teste passou: agendamento realizado com sucesso.");
    } else {
      console.error("❌ Teste falhou: mensagem de sucesso não encontrada.");
    }

    // --- Início fluxo logout ---
    await driver.sleep(1000);

    try {
      const btnMenuMobile = await driver.findElement(
        By.css("button.btn.btn-primary.d-md-none")
      );
      await btnMenuMobile.click();
      await driver.sleep(1000);
    } catch {
      console.log("ℹ️ Menu mobile não necessário ou não encontrado.");
    }

    const btnSair = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Sair')]")),
      5000
    );
    await btnSair.click();
    await driver.sleep(1000);

    try {
      const btnConfirmarLogout = await driver.wait(
        until.elementLocated(By.css("button.btn.btn-primary")),
        7000
      );
      await btnConfirmarLogout.click();
      await driver.sleep(1000);
    } catch {}

    await driver.wait(until.urlContains("/login"), 10000);
    await driver.sleep(2000);

    console.log("✅ Logout realizado com sucesso!");
  } catch (error) {
    console.error("❌ Erro no teste:", error.message);
  } finally {
    await driver.quit();
  }
}
