import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  const textos = [
    {
      titulo: "Cadastre-se na Zello",
      texto: "Ofereça ou contrate serviços de forma ágil.",
    },
    {
      titulo: "Conecte-se com Facilidade",
      texto:
        "Use filtros para encontrar o cuidador perfeito de acordo com suas necessidades.",
    },
    {
      titulo: "Avaliações Reais",
      texto:
        "Leia experiências de outros contratantes antes de tomar sua decisão.",
    },
    {
      titulo: "Agendamentos",
      texto:
        "Encontrou alguém perfeito? Verifique sua disponibilidade e agende um serviço.",
    },
    {
      titulo: "Segurança em Primeiro Lugar",
      texto:
        "Todos as transações passam por verificação de segurança criteriosas.",
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.bundle.min.js").then(() => {
        const carousel = document.getElementById("carouselSobre");
        if (carousel) {
          carousel.addEventListener("slide.bs.carousel", (e) => {
            setActiveIndex(e.to);
          });
        }
      });
    }
  }, []);

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold text-primary" href="/home">
            <img src="/img/ICONVIT.png" alt="" width="40px" height="50px" />
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
      <main className="flex-grow-1 d-flex flex-column bg-light">
        {/* Hero Section */}
        <section className="bg-light text-center py-3 mb-4">
          <div className="container">
            <h1 className="h3 text-primary fw-bold">
              Conectando cuidadores com quem precisa
            </h1>
            <p className="mt-2 mb-3 text-secondary small">
              O app da Zello facilita o encontro entre cuidadores qualificados e
              quem precisa de apoio. Segurança, carinho e confiança.
            </p>
            <a href="/cadastro" className="btn btn-primary btn-sm">
              Comece Agora
            </a>
          </div>
        </section>

        {/* Seção dividida */}
        <section className="d-flex flex-column flex-lg-row w-100 mt-3">
          {/* Texto dinâmico com animação */}
          <div className="w-100 w-lg-50 d-flex align-items-center justify-content-center bg-light p-4 text-center">
            <div key={activeIndex} className="fade-in">
              <h2 className="text-primary fw-bold fs-3">
                {textos[activeIndex].titulo}
              </h2>
              <p className="text-primary mb-0 fs-5">
                {textos[activeIndex].texto}
              </p>
            </div>
          </div>

          {/* Carrossel */}
          <div className="w-100 w-lg-50">
            <div
              id="carouselSobre"
              className="carousel slide"
              data-bs-ride="carousel"
              data-bs-interval="10000"
            >
              <div className="carousel-inner">
                {[1, 2, 3, 4, 5].map((num, index) => (
                  <div
                    key={num}
                    className={`carousel-item position-relative ${
                      index === 0 ? "active" : ""
                    }`}
                  >
                    <img
                      src={`/img/CR${num}.png`}
                      alt={`Slide ${num}`}
                      className="d-block w-100"
                      style={{ objectFit: "cover" }}
                    />
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
                />
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
                />
                <span className="visually-hidden">Próximo</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer padrão com espaço automático */}
      <footer className="bg-primary text-white text-center py-3 mt-auto">
        <div className="container">
          <p className="mb-0 small">
            &copy; 2025 Zello. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
