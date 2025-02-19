import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cadastro from "../cadastro.jsx";
import Login from "../login.jsx";
import PacienteDashboard from "../dashboardPaciente.jsx" ;

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/paciente" element={<PacienteDashboard />} />
            </Routes>
        </Router>
    );
}
