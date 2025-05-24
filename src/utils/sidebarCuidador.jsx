import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaCog,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBars,
} from "react-icons/fa";

const SidebarCuidador = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div
          className={`col-auto bg-primary text-white d-flex flex-column p-0 ${
            collapsed ? "min-vh-100" : "min-vh-100"
          }`}
          style={{ width: collapsed ? "70px" : "220px", transition: "0.3s" }}
        >
          <div
            className="d-flex justify-content-start align-items-center py-3"
            style={{ marginLeft: "11px" }}
          >
            <button
              className="btn btn-link text-white aling-items-center"
              onClick={toggleSidebar}
            >
              <FaBars />
              {!collapsed && <span className="ms-2">Menu - zello</span>}
            </button>
          </div>

          <ul className="nav nav-pills flex-column mb-auto px-2">
            <li className="nav-item">
              <Link to="/cuidador/perfil" className="nav-link text-white">
                <FaUser /> {!collapsed && <span className="ms-2">Perfil</span>}
              </Link>
            </li>
            <li>
              <Link to="/agendamentos" className="nav-link text-white">
                <FaCalendarAlt />{" "}
                {!collapsed && <span className="ms-2">Agendamentos</span>}
              </Link>
            </li>
            <li>
              <Link to="/pagamentos" className="nav-link text-white">
                <FaMoneyBillWave />{" "}
                {!collapsed && <span className="ms-2">Pagamentos</span>}
              </Link>
            </li>
            <li>
              <Link to="/configuracoes" className="nav-link text-white">
                <FaCog />{" "}
                {!collapsed && <span className="ms-2">Configurações</span>}
              </Link>
            </li>
          </ul>
        </div>

        {/* Conteúdo principal */}
        <div className="col p-4">{props.children}</div>
      </div>
    </div>
  );
};

export default SidebarCuidador;
