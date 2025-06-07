import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaCog,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserFriends,
  FaBars,
  FaHeadset,
  FaSignOutAlt
} from "react-icons/fa";

const SidebarContratante = ({ children }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Botão hamburguer (mobile) - aparece só quando menu móvel está fechado */}
      {!mobileOpen && (
        <button
          className="btn btn-primary d-md-none position-fixed top-0 start-0 m-3"
          style={{ zIndex: 1051 }}
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar MOBILE */}
      {mobileOpen && (
        <nav
          role="navigation"
          aria-label="Menu móvel"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#0d6efd", // cor do bg-primary Bootstrap
            color: "white",
            zIndex: 1050,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <span className="fw-bold fs-5">Menu - Zello</span>
            <button
              className="btn btn-light btn-sm"
              onClick={() => setMobileOpen(false)}
              aria-label="Fechar menu"
            >
              <FaTimes />
            </button>
          </div>

        {/* Menu com flex column e grow */}
        <ul 
          className="nav nav-pills flex-column px-2"
          style={{ flexGrow: 1 }}
        >
          <li className="nav-item">
            <Link to="/paciente" className="nav-link text-white">
              <FaSearch /> {!collapsed && <span className="ms-2">Procurar Cuidador</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/paciente/perfil" className="nav-link text-white">
              <FaUser /> {!collapsed && <span className="ms-2">Perfil</span>}
            </Link>
          </li>
          <li>
            <Link to="/agendamentos" className="nav-link text-white">
              <FaCalendarAlt />
              {!collapsed && <span className="ms-2">Agendamentos</span>}
            </Link>
          </li>
          <li>
            <Link to="/idoso" className="nav-link text-white">
              <FaUserFriends />
              {!collapsed && <span className="ms-2">Meus Idosos</span>}
            </Link>
          </li>
          <li>
            <Link className="nav-link text-white">
              <FaMoneyBillWave />
              {!collapsed && <span className="ms-2">Pagamentos</span>}
            </Link>
          </li>
          <li>
            <Link className="nav-link text-white">
              <FaCog />
              {!collapsed && <span className="ms-2">Configurações</span>}
            </Link>
          </li>
          <li>
            <Link to="/paciente/suporte" className="nav-link text-white">
              <FaHeadset />
              {!collapsed && <span className="ms-2">Suporte</span>}
            </Link>
          </li>
          {/* Espaço flex para empurrar o logout para baixo */}
          <li style={{ marginTop: "auto" }}>
            <button
              onClick={handleLogout}
              className="nav-link btn btn-link text-white text-start p-3"
              style={{ cursor: "pointer" }}
            >
              <FaSignOutAlt />
              {!collapsed && <span className="ms-2">Sair</span>}
            </button>
          </li>
        </ul>
      </div>

          {/* Conteúdo principal */}
          <main className="col p-4">{children}</main>
        </div>
      </div>
    </>
  );
};

export default SidebarContratante;
