import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaCog,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBars,
  FaSignOutAlt,
  FaHeadset,
  FaBell,
  FaTimes,
  FaHome,
  FaTasks,
} from "react-icons/fa";
import LogoutModal from "../utils/logout";
import ModalAcessibilidade from "../utils/modalAcessibilidade";

const SidebarCuidador = ({ children }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [showAcessibilidadeModal, setShowAcessibilidadeModal] = useState(false);

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
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  const sidebarWidth = collapsed ? "70px" : "220px";

  return (
    <>
      <LogoutModal
        show={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        loading={loadingLogout}
      />

      {showAcessibilidadeModal && (
        <ModalAcessibilidade onClose={() => setShowAcessibilidadeModal(false)} />
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
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-primary text-white"
          style={{ zIndex: 1050 }}
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
              <Link
                to="/cuidador"
                className="nav-link text-white"
                onClick={() => setMobileOpen(false)}
              >
                <FaHome />
                {!collapsed && <span className="ms-2">Início</span>}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/cuidador/perfil"
                className="nav-link text-white"
                onClick={() => setMobileOpen(false)}
              >
                <FaUser />
                {!collapsed && <span className="ms-2">Perfil</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/cuidador/agendamentos"
                className="nav-link text-white"
                onClick={() => setMobileOpen(false)}
              >
                <FaCalendarAlt />
                {!collapsed && <span className="ms-2">Agendamentos</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/cuidador/agendamentos/pendentes"
                className="nav-link text-white"
                onClick={() => setMobileOpen(false)}
              >
                <FaBell />
                {!collapsed && (
                  <span className="ms-2">Agendamentos Pendentes</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/cuidador/historico"
                className="nav-link text-white"
                onClick={() => setMobileOpen(false)}
              >
                <FaTasks />
                {!collapsed && (
                  <span className="ms-2">Histórico de Serviços</span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/cuidador/pagamentos"
                className="nav-link text-white"
                onClick={() => setMobileOpen(false)}
              >
                <FaMoneyBillWave />
                {!collapsed && <span className="ms-2">Pagamentos</span>}
              </Link>
            </li>
            <li>
              <button
                className="nav-link text-white bg-transparent border-0 text-start w-100"
                onClick={() => {
                  setShowAcessibilidadeModal(true);
                  setMobileOpen(false);
                }}
              >
                <FaCog />
                {!collapsed && <span className="ms-2">Acessibilidade</span>}
              </button>
            </li>
            <li>
              <Link
                to="/cuidador/suporte"
                className="nav-link text-white"
                onClick={() => setMobileOpen(false)}
              >
                <FaHeadset />
                {!collapsed && <span className="ms-2">Suporte</span>}
              </Link>
            </li>
            <li>
              <button
                className="nav-link text-white bg-transparent border-0 text-start w-100"
                onClick={() => {
                  setMobileOpen(false);
                  setShowLogoutModal(true);
                }}
                aria-label="Sair"
              >
                <FaSignOutAlt />
                {!collapsed && <span className="ms-2">Sair</span>}
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Sidebar DESKTOP fixa */}
      <nav
        className="d-none d-md-flex flex-column bg-primary text-white p-0 position-fixed top-0 start-0 vh-100"
        style={{
          width: sidebarWidth,
          transition: "width 0.3s",
          zIndex: 1040,
        }}
        role="navigation"
        aria-label="Menu lateral desktop"
      >
        <button
          className="btn btn-link text-white p-3 border-bottom text-start w-100 d-none d-md-flex"
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: "1.2rem" }}
          aria-label={collapsed ? "Expandir menu" : "Colapsar menu"}
        >
          <FaBars />
          {!collapsed && <span className="ms-2">Menu - Zello</span>}
        </button>

        <ul className="nav nav-pills flex-column px-2 mt-3">
          <li className="nav-item">
            <Link to="/cuidador" className="nav-link text-white">
              <FaHome />
              {!collapsed && <span className="ms-2">Início</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/cuidador/perfil" className="nav-link text-white">
              <FaUser />
              {!collapsed && <span className="ms-2">Perfil</span>}
            </Link>
          </li>
          <li>
            <Link to="/cuidador/agendamentos" className="nav-link text-white">
              <FaCalendarAlt />
              {!collapsed && <span className="ms-2">Agendamentos</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/cuidador/agendamentos/pendentes"
              className="nav-link text-white"
            >
              <FaBell />
              {!collapsed && (
                <span className="ms-2">Agendamentos Pendentes</span>
              )}
            </Link>
          </li>
          <li>
            <Link to="/cuidador/historico" className="nav-link text-white">
              <FaTasks />
              {!collapsed && (
                <span className="ms-2">Histórico de Serviços</span>
              )}
            </Link>
          </li>
          <li>
            <Link to="/cuidador/pagamentos" className="nav-link text-white">
              <FaMoneyBillWave />
              {!collapsed && <span className="ms-2">Pagamentos</span>}
            </Link>
          </li>
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
            <Link to="/cuidador/suporte" className="nav-link text-white">
              <FaHeadset />
              {!collapsed && <span className="ms-2">Suporte</span>}
            </Link>
          </li>
          <li>
            <button
              className="nav-link text-white bg-transparent border-0 text-start w-100"
              onClick={() => setShowLogoutModal(true)}
              aria-label="Sair"
            >
              <FaSignOutAlt />
              {!collapsed && <span className="ms-2">Sair</span>}
            </button>
          </li>
        </ul>
      </nav>

      {/* Conteúdo principal */}
      <main
        className="p-4"
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 0.3s",
        }}
      >
        {children}
      </main>
    </>
  );
};

export default SidebarCuidador;
