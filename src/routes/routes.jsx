import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cadastro from "../cadastro.jsx";
import Login from "../login.jsx";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
            </Routes>
        </Router>
    );
}
