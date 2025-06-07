import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  useEffect(() => {
    // Garante que o Bootstrap JS só será carregado no client-side
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.bundle.min.js");
    }
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-primary" href="/home">
            <img src="/img/ICON1.png" alt="" width="50px" height="50px" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto d-flex flex-column flex-lg-row align-items-center text-center text-lg-start">
              <li className="nav-item">
                <a className="nav-link px-3" href="/login">
                  Login
                </a>
              </li>
              <li className="nav-item mt-2 mt-lg-0">
                <a className="btn btn-primary ms-lg-2 px-4" href="/cadastro">
                  Cadastre-se
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <main className="flex-fill d-flex flex-column">
        {/* Hero Section */}
        <section className="bg-light text-center py-5">
          <div className="container">
            <h1 className="display-4 text-primary fw-bold">
              Conectando cuidadores com quem precisa
            </h1>
            <p className="lead mt-3 mb-4 text-secondary">
              A Zello facilita o encontro entre cuidadores qualificados e quem
              precisa de apoio. Segurança, carinho e confiança.
            </p>
            <a href="/cadastro" className="btn btn-primary btn-lg">
              Comece Agora
            </a>
          </div>
        </section>

        {/* Carrossel */}
        <div className="flex-grow-1 d-flex">
          <section className="bg-light text-center flex-fill d-flex align-items-center">
            <div
              id="carouselSobre"
              className="carousel slide w-100"
              data-bs-ride="carousel"
              data-bs-interval="10000"
            >
              <div className="carousel-inner">
                {[1, 2, 3, 4, 5].map((num, index) => (
                  <div
                    key={num}
                    className={`carousel-item ${index === 0 ? "active" : ""}`}
                  >
                    <div className="position-relative w-100">
                      {/* Imagem */}
                      <img
                        src={`/img/CR${num}.png`}
                        alt={`Slide ${num}`}
                        className="img-fluid w-100"
                        style={{
                          maxHeight: "57vh",
                          objectFit: "contain",
                        }}
                      />

                      {/* Camada escura sobre a imagem */}
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                      ></div>

                      {/* Conteúdo do slide */}
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center text-white px-3 text-center">
                        {/* Exemplo de conteúdo comentado, reative se quiser */}
                        {/* <div>
            <h5 className="display-6 fw-bold">
              {
                [
                  "1. Cadastre-se",
                  "2. Encontre ou Ofereça",
                  "3. Conecte-se com segurança",
                  "4. Agende facilmente",
                  "5. Receba pagamentos",
                ][index]
              }
            </h5>
            <p className="lead">
              {
                [
                  "Crie sua conta como cuidador ou contratante com poucos cliques.",
                  "Cuidadores divulgam serviços. Contratantes buscam por perfis.",
                  "Avaliações e verificação garantem confiança para todos.",
                  "Escolha data e hora conforme sua disponibilidade.",
                  "Transações seguras e simples direto pelo app.",
                ][index]
              }
            </p>
          </div> */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselSobre"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Anterior</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselSobre"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Próximo</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white text-center py-3">
        <div className="container">
          <p className="mb-0">
            &copy; 2025 ZelloApp. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
