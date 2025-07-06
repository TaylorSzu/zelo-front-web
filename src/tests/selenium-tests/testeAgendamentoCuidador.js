import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const tokenCuidador = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

export async function testeAgendamentoCuidador() {
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options())
    .build();

  try {
    // 1️⃣ Injetar o token no sessionStorage de forma segura
    await driver.get("http://localhost:5173/");
    await driver.executeScript(
      `window.sessionStorage.setItem('token', '${tokenCuidador}');`
    );
    await driver.navigate().refresh();
    await driver.sleep(1000);

    // 2️⃣ Acessar a página inicial do cuidador
    await driver.get("http://localhost:5173/cuidador");
    await driver.sleep(2000);

    // 3️⃣ Clique no link Agendamentos Pendentes
    const pendentesLink = await driver.wait(
      until.elementLocated(By.linkText("Agendamentos Pendentes")),
      5000
    );
    await pendentesLink.click();
    await driver.sleep(2000);

    // 4️⃣ Aguarde e clique no botão Confirmar do primeiro card
    await driver.wait(until.elementLocated(By.css(".btn-success")), 5000);
    const confirmarBtn = await driver.findElement(By.css(".btn-success"));
    await confirmarBtn.click();
    await driver.sleep(2000);

    // 5️⃣ Verifique toast de sucesso
    await driver.wait(
      until.elementLocated(By.css(".Toastify__toast--success")),
      5000
    );
    console.log("✅ Agendamento confirmado com sucesso.");
    await driver.sleep(1000);

    // 6️⃣ Aguarde redirecionamento para agendamentos
    await driver.wait(until.urlContains("/cuidador/agendamentos"), 5000);
    await driver.sleep(2000);

    // 7️⃣ Clique no primeiro evento do calendário
    await driver.wait(until.elementLocated(By.css(".rbc-event")), 5000);
    const evento = await driver.findElement(By.css(".rbc-event"));
    await evento.click();
    await driver.sleep(2000);

    // 8️⃣ Clique no botão Cancelar Agendamento
    await driver.wait(until.elementLocated(By.css(".btn-danger")), 5000);
    const cancelarBtn = await driver.findElement(By.css(".btn-danger"));
    await cancelarBtn.click();
    await driver.sleep(2000);

    // 9️⃣ Verifique toast de sucesso no cancelamento
    await driver.wait(
      until.elementLocated(By.css(".Toastify__toast--success")),
      5000
    );
    console.log("✅ Cancelamento realizado com sucesso.");
    await driver.sleep(1000);

    console.log("✅ Teste do agendamento do cuidador concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante o teste:", error.message);
  } finally {
    await driver.quit();
  }
}
