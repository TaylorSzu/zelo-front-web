import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AvisoTaxa from "../utils/avisoTaxa.jsx";
import {
  FaCalendarCheck,
  FaMoneyBillWave,
  FaUserCircle,
  FaClock,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; // IMPORTAÇÃO DO COOKIES

export default function PainelCuidador() {
  const [dashboardData, setDashboardData] = useState({
    totalRecebido: 0,
    totalConfirmados: 0,
    totalPendentes: 0,
  });
  const [usuario, setUsuario] = useState(null);
  const [showAviso, setShowAviso] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cuidadorId = sessionStorage.getItem("cuidadorId");
    const token = Cookies.get("token"); // Pega token do cookie
    const nomeUsuario = sessionStorage.getItem("nomeUsuario");

    if (!cuidadorId || !token) {
      sessionStorage.clear();
      navigate("/login");
      return;
    }

    if (nomeUsuario) {
      setUsuario({ nome: nomeUsuario }); // Mostra nome rápido enquanto carrega dados completos
    }

    const jaViuAviso = sessionStorage.getItem(`avisoTaxa_visto_${cuidadorId}`);
    if (!jaViuAviso) setShowAviso(true);

    axios
      .all([
        axios.post(
          "http://localhost:5171/usuario/dashboard/cuidador",
          { cuidadorId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get("http://localhost:5171/usuario/encontrar", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])
      .then(
        axios.spread((dashboardRes, usuarioRes) => {
          setDashboardData(dashboardRes.data);
          setUsuario(usuarioRes.data);
        })
      )
      .catch((err) => {
        console.error("Erro ao carregar dados:", err);
        if (err.response?.status === 401) {
          sessionStorage.clear();
          navigate("/login");
        }
      });
  }, [navigate]);

  const handleFecharAviso = () => {
    const cuidadorId = sessionStorage.getItem("cuidadorId");
    if (cuidadorId) {
      sessionStorage.setItem(`avisoTaxa_visto_${cuidadorId}`, "true");
    }
    setShowAviso(false);
  };

  return (
    <>
      <AvisoTaxa show={showAviso} onClose={handleFecharAviso} />
      <div
        className="container px-2 px-sm-3 px-md-4 px-lg-5"
        style={{
          minHeight: "100vh",
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >
        <div className="card shadow-lg rounded-4 border-0">
          <div className="card-header bg-primary text-white rounded-top-4 text-center">
            <h3 className="m-0">Dashboard do Cuidador</h3>
          </div>

          <div className="card-body">
            {/* Foto do cuidador com borda e efeito hover */}
            <div
              className="mb-4 text-center position-relative"
              style={{ width: "150px", height: "150px", margin: "0 auto" }}
            >
              <div
                className="rounded-circle overflow-hidden border border-3 border-primary"
                style={{
                  width: "150px",
                  height: "150px",
                  position: "relative",
                }}
              >
                <img
                  src={usuario?.foto || "../src/assets/perfil.png"}
                  alt="Foto de perfil"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
                <label
                  htmlFor="fileInputCuidador"
                  className="d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                    opacity: 0,
                    cursor: "pointer",
                    transition: "opacity 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                >
                  Alterar
                  <input
                    type="file"
                    id="fileInputCuidador"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setUsuario((prev) => ({
                          ...prev,
                          foto: URL.createObjectURL(file),
                        }));
                      }
                    }}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>

            {/* Texto de boas vindas */}
            <div className="text-center mt-4">
              <h5 className="text-dark d-flex justify-content-center align-items-center gap-2">
                <FaUser className="text-primary" />
                Bem-vindo(a),{" "}
                <span className="fw-bold">{usuario?.nome || "Cuidador"}</span>!
              </h5>
            </div>

            {/* Cards das informações do dashboard */}
            <div className="row g-3 justify-content-center">
              <div className="col-md-6 col-lg-4 col-xl-3">
                <div className="card text-center shadow rounded-4">
                  <div className="card-body">
                    <FaCalendarCheck size={40} className="text-info mb-2" />
                    <h5 className="card-title">Agendamentos Confirmados</h5>
                    <p className="card-text fs-4">
                      {dashboardData.totalConfirmados}
                    </p>
                    <p className="text-muted mb-2">Confirmados</p>
                    <button
                      className="btn btn-outline-info"
                      onClick={() => navigate("/cuidador/agendamentos")}
                    >
                      Ver agendamentos
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4 col-xl-3">
                <div className="card text-center shadow rounded-4">
                  <div className="card-body">
                    <FaMoneyBillWave size={40} className="text-success mb-2" />
                    <h5 className="card-title">Total Recebido</h5>
                    <p className="card-text fs-4">
                      {dashboardData.totalRecebido.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                    <p className="text-muted mb-2">Valor recebido</p>
                    <button
                      className="btn btn-outline-success"
                      onClick={() => navigate("/cuidador/pagamentos")}
                    >
                      Ver pagamentos
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4 col-xl-3">
                <div className="card text-center shadow rounded-4">
                  <div className="card-body">
                    <FaClock size={40} className="text-warning mb-2" />
                    <h5 className="card-title">Pendentes</h5>
                    <p className="card-text fs-4">
                      {dashboardData.totalPendentes}
                    </p>
                    <p className="text-muted mb-2">Agendamentos pendentes</p>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/cuidador/agendamentos/pendentes")
                      }
                    >
                      Acompanhar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista recente, se quiser adicionar */}
          </div>
        </div>
      </div>
    </>
  );
}
