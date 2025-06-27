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
  FaSignOutAlt,
  FaTimes,
  FaHeadset,
  FaHome,
} from "react-icons/fa";
import LogoutModal from "../utils/logout";
import ModalAcessibilidade from "../utils/modalAcessibilidade";

const SidebarContratante = ({ children }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [showAcessibilidadeModal, setShowAcessibilidadeModal] = useState(false); // NOVO ESTADO

  const handleNavigation = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  const confirmLogout = async () => {
    setLoadingLogout(true);
    try {
      const response = await fetch("http://localhost:5171/usuario/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setTimeout(() => {
        if (response.ok) {
          setShowLogoutModal(false);
          navigate("/login");
        } else {
          alert("Erro ao sair. Tente novamente.");
        }
        setLoadingLogout(false);
      }, 3000);
    } catch (error) {
      console.error("Erro no logout:", error);
      alert("Erro ao sair. Tente novamente.");
      setLoadingLogout(false);
    }
  };

  return (
    <>
      {/* Modal de logout */}
      <LogoutModal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        loading={loadingLogout}
      />

      {/* Modal de acessibilidade */}
      {showAcessibilidadeModal && (
        <ModalAcessibilidade
          onClose={() => setShowAcessibilidadeModal(false)}
        />
      )}

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
            backgroundColor: "#0d6efd",
            color: "white",
            zIndex: 1050,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <span className="fw-bold fs-5">Menu - Zello</span>
            <button
              className="btn btn-outline-light btn-sm"
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                onClick={() => handleNavigation("/paciente/encontrar")}
              >
                <FaSearch /> <span className="ms-2">Encontrar Cuidador</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white bg-transparent border-0 text-start"
                onClick={() => handleNavigation("/paciente")}
              >
                <FaHome />
                {!collapsed && <span className="ms-2">Início</span>}
              </button>
            </li>

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
                onClick={() => handleNavigation("/paciente/agendamentos")}
              >
                <FaCalendarAlt /> <span className="ms-2">Agendamentos</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white bg-transparent border-0 text-start"
                onClick={() => handleNavigation("/paciente/idoso")}
              >
                <FaUserFriends /> <span className="ms-2">Meus Idosos</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white bg-transparent border-0 text-start"
                onClick={() => handleNavigation("/paciente/pagamentos")}
              >
                <FaMoneyBillWave /> <span className="ms-2">Pagamentos</span>
              </button>
            </li>
            {/* Aqui chama modal acessibilidade */}
            <li className="nav-item">
              <button
                className="nav-link text-white bg-transparent border-0 text-start"
                onClick={() => {
                  setShowAcessibilidadeModal(true);
                  setMobileOpen(false);
                }}
              >
                <FaCog /> <span className="ms-2">Acessibilidade</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white bg-transparent border-0 text-start"
                onClick={() => handleNavigation("/paciente/suporte")}
              >
                <FaHeadset /> <span className="ms-2">Suporte</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white bg-transparent border-0 text-start"
                onClick={() => {
                  setMobileOpen(false);
                  setShowLogoutModal(true);
                }}
              >
                <FaSignOutAlt /> <span className="ms-2">Sair</span>
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Sidebar DESKTOP */}
      <div className="container-fluid">
        <div className="row">
          <nav
            className="d-none d-md-flex flex-column bg-primary text-white p-0 min-vh-100"
            style={{
              width: collapsed ? "70px" : "220px",
              transition: "width 0.3s",
            }}
            role="navigation"
            aria-label="Menu lateral desktop"
          >
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
              <li>
                <Link to="/paciente/encontrar" className="nav-link text-white">
                  <FaSearch />
                  {!collapsed && (
                    <span className="ms-2">Encontrar cuidador</span>
                  )}
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/paciente" className="nav-link text-white">
                  <FaHome />
                  {!collapsed && <span className="ms-2">Início</span>}
                </Link>
              </li>
              <li>
                <Link to="/paciente/perfil" className="nav-link text-white">
                  <FaUser />
                  {!collapsed && <span className="ms-2">Perfil</span>}
                </Link>
              </li>
              <li>
                <Link
                  to="/paciente/agendamentos"
                  className="nav-link text-white"
                >
                  <FaCalendarAlt />
                  {!collapsed && <span className="ms-2">Agendamentos</span>}
                </Link>
              </li>
              <li>
                <Link to="/paciente/idoso" className="nav-link text-white">
                  <FaUserFriends />
                  {!collapsed && <span className="ms-2">Meus Idosos</span>}
                </Link>
              </li>
              <li>
                <Link to="/paciente/pagamentos" className="nav-link text-white">
                  <FaMoneyBillWave />
                  {!collapsed && <span className="ms-2">Pagamentos</span>}
                </Link>
              </li>
              {/* Aqui chama modal acessibilidade */}
              <li>
                <button
                  className="nav-link text-white bg-transparent border-0 text-start w-100"
                  onClick={() => setShowAcessibilidadeModal(true)}
                >
                  <FaCog />
                  {!collapsed && <span className="ms-2">Acessibilidade</span>}
                </button>
              </li>
              <li>
                <Link to="/paciente/suporte" className="nav-link text-white">
                  <FaHeadset />
                  {!collapsed && <span className="ms-2">Suporte</span>}
                </Link>
              </li>
              <li>
                <button
                  className="nav-link text-white bg-transparent border-0 text-start w-100"
                  onClick={() => setShowLogoutModal(true)}
                >
                  <FaSignOutAlt />
                  {!collapsed && <span className="ms-2">Sair</span>}
                </button>
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
