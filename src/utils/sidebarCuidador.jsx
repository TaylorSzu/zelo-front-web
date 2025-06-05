import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaCog,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBars,
  FaSignOutAlt,
  FaHeadset,
  FaBell
} from "react-icons/fa";

const SidebarCuidador = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div
          className={`col-auto bg-primary text-white d-flex flex-column p-0 min-vh-100`}
          style={{
            width: collapsed ? "70px" : "220px",
            transition: "width 0.3s",
          }}
        >
          <div
            className="d-flex justify-content-start align-items-center py-3"
            style={{ marginLeft: "11px" }}
          >
            <button
              className="btn btn-link text-white align-items-center"
              onClick={toggleSidebar}
            >
              <FaBars />
              {!collapsed && <span className="ms-2">Menu - Zelo</span>}
            </button>
          </div>

          <ul className="nav nav-pills flex-column mb-auto px-2">
            <li className="nav-item">
              <Link to="/cuidador/perfil" className="nav-link text-white">
                <FaUser />
                {!collapsed && <span className="ms-2">Perfil</span>}
              </Link>
            </li>
            <li>
              <Link to="/agendamentos/cuidador" className="nav-link text-white">
                <FaCalendarAlt />
                {!collapsed && <span className="ms-2">Agendamentos</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/agendamentos/cuidador/pendentes"
                className="nav-link text-white"
              >
                <FaBell />
                {!collapsed && (
                  <span className="ms-2">Agendamentos Pendentes</span>
                )}
              </Link>
            </li>
            <li>
              <Link to="/pagamentos" className="nav-link text-white">
                <FaMoneyBillWave />
                {!collapsed && <span className="ms-2">Pagamentos</span>}
              </Link>
            </li>
            <li>
              <Link to="/configuracoes" className="nav-link text-white">
                <FaCog />
                {!collapsed && <span className="ms-2">Configurações</span>}
              </Link>
            </li>
            <li>
              <Link to="/cuidador/suporte" className="nav-link text-white">
                <FaHeadset />
                {!collapsed && <span className="ms-2">Suporte</span>}
              </Link>
            </li>
          </ul>

          {/* Botão de sair fixo no rodapé */}
          <div className="mt-auto px-2 pb-3">
            <button
              onClick={handleLogout}
              className="nav-link btn btn-link text-white text-start w-100"
              style={{ cursor: "pointer" }}
            >
              <FaSignOutAlt />
              {!collapsed && <span className="ms-2">Sair</span>}
            </button>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="col p-4">{props.children}</div>
      </div>
    </div>
  );
};

export default SidebarCuidador;
