import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "../usuario/home.jsx";
import Cadastro from "../usuario/cadastro.jsx";
import Login from "../usuario/login.jsx";
import Logout from "../usuario/logout.jsx";
import RecuperarSenha from "../usuario/recuperarSenha.jsx";
import PacienteDashboard from "../contratante/dashboardContratante.jsx";
import PainelCuidador from "../cuidador/dashboardCuidador.jsx";
import PerfilCuidador from "../cuidador/perfilCuidador.jsx";
import Agendamentos from "../agendamento.jsx";
import MarcaAgendamento from "../marcaAgendamento.jsx";
import PerfilContratante from "../contratante/perfilContratante.jsx";
import GerenciarIdosos from "../idoso/gerenciarIdosos.jsx";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/recuperarSenha" element={<RecuperarSenha />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/paciente" element={<PacienteDashboard />} />
        <Route path="/cuidador" element={<PainelCuidador />} />
        <Route path="/cuidador/perfil" element={<PerfilCuidador />} />
        <Route path="/paciente/perfil" element={<PerfilContratante />} />
        <Route path="/idoso" element={<GerenciarIdosos />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
        <Route path="/agendamentos/marcar" element={<MarcaAgendamento />} />
      </Routes>
    </Router>
  );
}
