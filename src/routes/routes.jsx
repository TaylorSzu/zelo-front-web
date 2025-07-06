import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "../usuario/home.jsx";
import Cadastro from "../usuario/cadastro.jsx";
import Login from "../usuario/login.jsx";
import Logout from "../utils/logout.jsx";
import RecuperarSenha from "../usuario/recuperarSenha.jsx";
import RegistrarNovaSenha from "../usuario/registrarNovaSenha.jsx";
import PacienteDashboard from "../contratante/dashboardContratante.jsx";
import EncontrarCuidador from "../contratante/encontrarCuidador.jsx";
import PainelCuidador from "../cuidador/dashboardCuidador.jsx";
import PerfilCuidador from "../cuidador/perfilCuidador.jsx";
import Agendamentos from "../contratante/agendamento.jsx";
import AgendamentosCuidador from "../cuidador/agendamentosCuidador.jsx";
import AgendamentosPendentesCuidador from "../cuidador/agendamentoPendentes.jsx";
import MarcaAgendamento from "../contratante/marcaAgendamento.jsx";
import PerfilContratante from "../contratante/perfilContratante.jsx";
import GerenciarIdosos from "../idoso/gerenciarIdosos.jsx";
import SuporteContratante from "../suporte/suporteContratante.jsx";
import SuporteCuidador from "../suporte/suporteCuidador.jsx";
import Acessibilidade from "../usuario/acessibilidadeContratante";
import PagamentosContratante from "../pagamentos/dashboardPagamentos.jsx";
import PagamentosCuidador from "../pagamentos/zelloPagamentos.jsx";
import { AcessibilidadeProvider } from "../context/acessibilidadeContext.jsx";
import SidebarContratante from "../utils/sidebarContratante.jsx";
import SidebarCuidador from "../utils/sidebarCuidador.jsx";
import AvaliacoesCuidador from "../contratante/avaliacoesCuidador.jsx";
import HistoricoServicos from "../cuidador/historicoServicos.jsx";

// Layout para paciente/contratante
const LayoutContratante = ({ children }) => (
  <SidebarContratante>{children}</SidebarContratante>
);

// Layout para cuidador
const LayoutCuidador = ({ children }) => (
  <SidebarCuidador>{children}</SidebarCuidador>
);

export default function AppRoutes() {
  return (
    <AcessibilidadeProvider>
      <Router>
        <Routes>
          {/* Rota padrão para home */}
          <Route path="*" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/recuperarSenha" element={<RecuperarSenha />} />
          <Route path="/registrarNovaSenha" element={<RegistrarNovaSenha />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/acessibilidade" element={<Acessibilidade />} />

          {/* Rotas paciente */}
          <Route
            path="/paciente/*"
            element={
              <LayoutContratante>
                <Routes>
                  <Route path="" element={<PacienteDashboard />} />
                  <Route path="encontrar" element={<EncontrarCuidador />} />
                  <Route path="perfil" element={<PerfilContratante />} />
                  <Route path="suporte" element={<SuporteContratante />} />
                  <Route path="idoso" element={<GerenciarIdosos />} />
                  <Route
                    path="agendamentos/marcar"
                    element={<MarcaAgendamento />}
                  />
                  <Route path="agendamentos" element={<Agendamentos />} />
                  <Route
                    path="pagamentos"
                    element={<PagamentosContratante />}
                  />
                  <Route
                    path="cuidador/:cuidadorId/avaliacoes"
                    element={<AvaliacoesCuidador />}
                  />
                </Routes>
              </LayoutContratante>
            }
          />

          {/* Rotas cuidador */}
          <Route
            path="/cuidador/*"
            element={
              <LayoutCuidador>
                <Routes>
                  <Route path="" element={<PainelCuidador />} />
                  <Route path="perfil" element={<PerfilCuidador />} />
                  <Route path="suporte" element={<SuporteCuidador />} />
                  <Route
                    path="agendamentos/pendentes"
                    element={<AgendamentosPendentesCuidador />}
                  />
                  <Route
                    path="agendamentos"
                    element={<AgendamentosCuidador />}
                  />
                  <Route
                    path="historico"
                    element={<HistoricoServicos />}
                  />
                  <Route path="pagamentos" element={<PagamentosCuidador />} />
                </Routes>
              </LayoutCuidador>
            }
          />
        </Routes>
      </Router>
    </AcessibilidadeProvider>
  );
}
