export async function loginComToken(driver, token, url) {
  await driver.get("http://localhost:5173"); // Carrega o domínio antes de setar cookie

  await driver.manage().addCookie({
    name: "token",
    value: token,
    path: "/",
  });

  await driver.get(url); // Agora sim carrega a página logada
}
