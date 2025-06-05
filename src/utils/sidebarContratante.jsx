import React, { useState } from "react";
import { Link } from "react-router-dom";
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

const SidebarContratante = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      {/* Sidebar fixa */}
      <div
        className={`bg-primary text-white d-flex flex-column position-fixed top-0 start-0 min-vh-100`}
        style={{
          width: collapsed ? "70px" : "220px",
          transition: "0.3s",
          zIndex: 1000,
        }}
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
      <div
        className="p-4"
        style={{ marginLeft: collapsed ? "70px" : "220px", transition: "0.3s" }}
      >
        {props.children}
      </div>
    </div>
  );
};

export default SidebarContratante;
