import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaCog,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserFriends,
  FaBars,
} from "react-icons/fa";

const SidebarContratante = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
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

        <ul className="nav nav-pills flex-column mb-auto px-2">
          <li className="nav-item">
            <Link to="/paciente/perfil" className="nav-link text-white">
              <FaUser /> {!collapsed && <span className="ms-2">Perfil</span>}
            </Link>
          </li>
          <li>
            <Link to="/configuracoes" className="nav-link text-white">
              <FaCog />
              {!collapsed && <span className="ms-2">Configurações</span>}
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
            <Link to="/idoso" className="nav-link text-white">
              <FaUserFriends />
              {!collapsed && <span className="ms-2">Meus Idosos</span>}
            </Link>
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
