import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaCog,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBars,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

const SidebarCuidador = ({ children }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigation = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false); // Fecha o menu mobile automaticamente ao retornar ao desktop
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Botão hamburguer (mobile) - aparece somente se o menu mobile estiver fechado */}
      {!mobileOpen && (
        <button
          className="btn btn-primary d-md-none position-fixed top-0 start-0 m-3"
          style={{ zIndex: 1051 }}
          onClick={() => setMobileOpen(true)}
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar MOBILE */}
      {mobileOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-primary text-white"
          style={{ zIndex: 1050 }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <span className="fw-bold fs-5 mg-5">Menu - Zello</span>
            <button
              className="btn btn-outline-light btn-sm"
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "20px",
              }}
              onClick={() => setMobileOpen(false)}
              aria-label="Fechar menu"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <ul className="nav flex-column p-3">
            <li className="nav-item">
              <button
                className="nav-link text-white bg-transparent border-0 text-start"
                onClick={() => handleNavigation("/cuidador/perfil")}
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
                onClick={() => handleNavigation("/usuario/logout")}
              >
                <FaSignOutAlt /> <span className="ms-2">Sair</span>
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Layout principal (desktop) */}
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar DESKTOP */}
          <div
            className="d-none d-md-flex flex-column bg-primary text-white p-0 min-vh-100"
            style={{
              width: collapsed ? "70px" : "220px",
              transition: "width 0.3s",
            }}
          >
            {/* Botão de colapsar APENAS no desktop */}
            <button
              className="btn btn-link text-white p-3 border-bottom text-start w-100 d-none d-md-flex"
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "1.2rem" }}
            >
              <FaBars />
              {!collapsed && <span className="ms-2">Menu - Zello</span>}
            </button>

            <ul className="nav nav-pills flex-column px-2 mt-3">
              <li className="nav-item">
                <Link to="/cuidador/perfil" className="nav-link text-white">
                  <FaUser />{" "}
                  {!collapsed && <span className="ms-2">Perfil</span>}
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
              <li>
                <Link to="/usuario/logout" className="nav-link text-white">
                  <FaSignOutAlt />{" "}
                  {!collapsed && <span className="ms-2">Sair</span>}
                </Link>
              </li>
            </ul>
          </div>

          {/* Conteúdo principal */}
          <div className="col p-4">{children}</div>
        </div>
      </div>
    </>
  );
};

export default SidebarCuidador;
