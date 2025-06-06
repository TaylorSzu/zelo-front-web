import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaCog,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserFriends,
  FaBars,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

const SidebarContratante = ({ children }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigation = (path) => {
    setMobileOpen(false); // fecha menu móvel ao navegar
    navigate(path);
  };

  // Fecha menu móvel ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Controla overflow do body para evitar rolagem quando menu móvel aberto
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // limpa no unmount
    };
  }, [mobileOpen]);

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

          <ul className="nav flex-column p-3">
            <li className="nav-item">
              <button
                className="nav-link text-white bg-transparent border-0 text-start"
                onClick={() => handleNavigation("/paciente/perfil")}
              >
                <FaUser /> <span className="ms-2">Perfil</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white bg-transparent border-0 text-start"
                onClick={() => handleNavigation("/agendamentos")}
              >
                <FaCalendarAlt /> <span className="ms-2">Agendamentos</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white bg-transparent border-0 text-start"
                onClick={() => handleNavigation("/pagamentos")}
              >
                <FaMoneyBillWave /> <span className="ms-2">Pagamentos</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white bg-transparent border-0 text-start"
                onClick={() => handleNavigation("/configuracoes")}
              >
                <FaCog /> <span className="ms-2">Configurações</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white bg-transparent border-0 text-start"
                onClick={() => handleNavigation("/idoso")}
              >
                <FaUserFriends /> <span className="ms-2">Meus Idosos</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white bg-transparent border-0 text-start"
                onClick={() => handleNavigation("/usuario/logout")}
              >
                <FaSignOutAlt /> <span className="ms-2">Sair</span>
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Layout principal (desktop) */}
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar DESKTOP */}
          <nav
            className="d-none d-md-flex flex-column bg-primary text-white p-0 min-vh-100"
            style={{
              width: collapsed ? "70px" : "220px",
              transition: "width 0.3s",
            }}
            role="navigation"
            aria-label="Menu lateral desktop"
          >
            {/* Botão colapsar - só no desktop */}
            <button
              className="btn btn-link text-white p-3 border-bottom text-start w-100 d-none d-md-flex"
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "1.2rem" }}
              aria-expanded={!collapsed}
              aria-label={collapsed ? "Expandir menu" : "Colapsar menu"}
            >
              <FaBars />
              {!collapsed && <span className="ms-2">Menu - Zello</span>}
            </button>

            <ul className="nav nav-pills flex-column px-2 mt-3">
              <li className="nav-item">
                <Link to="/paciente/perfil" className="nav-link text-white">
                  <FaUser />
                  {!collapsed && <span className="ms-2">Perfil</span>}
                </Link>
              </li>
              <li>
                <Link to="/agendamentos" className="nav-link text-white">
                  <FaCalendarAlt />
                  {!collapsed && <span className="ms-2">Agendamentos</span>}
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
                <Link to="/idoso" className="nav-link text-white">
                  <FaUserFriends />
                  {!collapsed && <span className="ms-2">Meus Idosos</span>}
                </Link>
              </li>
              <li>
                <Link to="/usuario/logout" className="nav-link text-white">
                  <FaSignOutAlt />
                  {!collapsed && <span className="ms-2">Sair</span>}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Conteúdo principal */}
          <main className="col p-4">{children}</main>
        </div>
      </div>
    </>
  );
};

export default SidebarContratante;
