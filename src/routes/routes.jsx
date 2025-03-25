import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cadastro from "../cadastro.jsx";
import Login from "../login.jsx";
import PacienteDashboard from "../dashboardPaciente.jsx" ;
import PainelCuidador from "../dashboardCuidador.jsx";
import PerfilCuidador from "../perfilCuidador.jsx";
import Agendamentos from "../agendamento.jsx";
import MarcaAgendamento from "../marcaAgendamento.jsx";
import PerfilContratante from "../perfilContratante.jsx";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/paciente" element={<PacienteDashboard />} />
                <Route path="/cuidador" element={<PainelCuidador />} />
                <Route path="/cuidador/perfil" element={<PerfilCuidador />} />
                <Route path="/paciente/perfil" element={<PerfilContratante />} />
                <Route path="/agendamentos" element={<Agendamentos />} />
                <Route path="/agendamentos/marcar" element={<MarcaAgendamento />} />
            </Routes>
        </Router>
    );
}
