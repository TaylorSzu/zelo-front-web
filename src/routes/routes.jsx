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

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/recuperarSenha" element={<RecuperarSenha />} />
        <Route path="/registrarNovaSenha" element={<RegistrarNovaSenha />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/acessibilidade" element={<Acessibilidade />} />

        {/* CUIDADOR */}
        <Route path="/cuidador" element={<PainelCuidador />} />
        <Route path="/cuidador/perfil" element={<PerfilCuidador />} />
        <Route path="/cuidador/suporte" element={<SuporteCuidador />} />
        <Route
          path="/agendamentos/cuidador/pendentes"
          element={<AgendamentosPendentesCuidador />}
        />
        <Route
          path="/agendamentos/cuidador"
          element={<AgendamentosCuidador />}
        />

        {/* PACIENTE */}
        <Route path="/paciente" element={<PacienteDashboard />} />
        <Route path="/paciente/perfil" element={<PerfilContratante />} />
        <Route path="/paciente/suporte" element={<SuporteContratante />} />
        <Route path="/idoso" element={<GerenciarIdosos />} />
        <Route path="/agendamentos/marcar" element={<MarcaAgendamento />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
      </Routes>
    </Router>
  );
}
