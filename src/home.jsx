
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold text-primary" href="#">
            zEllo
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
      <main className="flex-fill">
        {/* Hero Section */}
        <section className="bg-light text-center py-5">
          <div className="container">
            <h1 className="display-4 text-primary fw-bold">
              Conectando cuidadores com quem precisa
            </h1>
            <p className="lead mt-3 mb-4 text-secondary">
              A Zelo facilita o encontro entre cuidadores qualificados e quem
              precisa de apoio. Segurança, carinho e confiança.
            </p>
            <a href="/cadastro" className="btn btn-primary btn-lg">
              Comece Agora
            </a>
          </div>
        </section>

        {/* Sobre / Como Funciona */}
        <section id="sobre" className="py-5">
          <div className="container text-center">
            <h2 className="mb-4 text-secondary fw-bold">
              Como o Zelo funciona?
            </h2>
            <div className="row">
              <div className="col-md-4">
                <h5 className="text-primary">1. Cadastre-se</h5>
                <p>
                  Crie sua conta como cuidador ou contratante com poucos
                  cliques.
                </p>
              </div>
              <div className="col-md-4">
                <h5 className="text-primary">2. Encontre ou Ofereça</h5>
                <p>
                  Cuidadores podem divulgar seus serviços. Contratantes buscam
                  por perfis.
                </p>
              </div>
              <div className="col-md-4">
                <h5 className="text-primary">3. Conecte-se com segurança</h5>
                <p>
                  Avaliações, histórico e verificação garantem confiança para
                  todos.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white text-center py-3">
        <div className="container">
          <p className="mb-0">
            &copy; 2025 zEloApp. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

