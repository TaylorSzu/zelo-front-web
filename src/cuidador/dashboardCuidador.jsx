import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SidebBarCuidador from "../utils/sidebarCuidador.jsx";

const PainelCuidador = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const [pagamentos, setPagamentos] = useState([]);
    const [usuario, setUsuario] = useState(null);

    return (
        <div>
        {/* Sidebar */}
        <div className="col-auto p-0">
          <SidebBarCuidador />
        </div>
        </div>
    );
};

export default PainelCuidador;
