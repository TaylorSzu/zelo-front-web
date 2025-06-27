import React, { useEffect, useState } from "react";
import {
  FaUserFriends,
  FaCalendarAlt,
  FaHourglassHalf,
  FaUserCircle,
  FaMoneyBillWave,
  FaUser,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie";

export default function DashboardContratante() {
  const [dados, setDados] = useState({
    idosos: 0,
    agendamentoConfirmados: 0,
    agendamentoPendentes: 0,
    pagamentoPendentes: 0,
  });

  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const contratanteId = sessionStorage.getItem("contratanteId");
    const token = Cookies.get("token");

    if (!contratanteId || !token) {
      sessionStorage.clear();
      navigate("/login");
      return;
    }

    // busca dashboard e dados do usuário
    Promise.all([
      axios.post(
        "http://localhost:5171/usuario/dashboard/contratante",
        { contratanteId },
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      axios.get("http://localhost:5171/usuario/encontrar", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([dashboardRes, usuarioRes]) => {
        setDados(dashboardRes.data || {});
        setUsuario(usuarioRes.data);
      })
      .catch((err) => {
        console.error("Erro ao carregar o dashboard:", err);
        if (err.response?.status === 401) {
          sessionStorage.clear();
          navigate("/login");
        }
      });
  }, [navigate]);

  return (
    <div
      className="container px-2 px-sm-3 px-md-4 px-lg-5"
      style={{ minHeight: "100vh", paddingTop: "40px", paddingBottom: "40px" }}
    >
      <div className="card shadow-lg rounded-4 border-0">
        <div className="card-header bg-primary text-white rounded-top-4 text-center">
          <h3 className="m-0">Dashboard do Contratante</h3>
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
                htmlFor="fileInputContratante"
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
                  id="fileInputContratante"
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

          {/* Mensagem de boas-vindas */}
          <div className="text-center mt-2 mb-4">
            <h5 className="text-dark d-flex justify-content-center align-items-center gap-2">
              <FaUser className="text-primary" />
              Bem-vindo(a),{" "}
              <span className="fw-bold">{usuario?.nome || "Contratante"}</span>!
            </h5>
          </div>

          {/* Cards informativos */}
          <div className="row g-3 justify-content-center">
            <div className="col-md-6 col-lg-4 col-xl-3">
              <div className="card text-center shadow rounded-4">
                <div className="card-body">
                  <FaUserFriends size={40} className="text-primary mb-2" />
                  <h5 className="card-title">Idosos Cadastrados</h5>
                  <p className="card-text fs-4">{dados.idosos}</p>
                  <p className="text-muted mb-2">Gerenciar idosos</p>
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate("/paciente/idoso")}
                  >
                    Ver idosos
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 col-xl-3">
              <div className="card text-center shadow rounded-4">
                <div className="card-body">
                  <FaCalendarAlt size={40} className="text-info mb-2" />
                  <h5 className="card-title">Agendamentos Confirmados</h5>
                  <p className="card-text fs-4">
                    {dados.agendamentoConfirmados}
                  </p>
                  <p className="text-muted mb-2">Confirmados</p>
                  <button
                    className="btn btn-outline-info w-100"
                    onClick={() => navigate("/paciente/agendamentos")}
                  >
                    Ver agendamentos
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 col-xl-3">
              <div className="card text-center shadow rounded-4">
                <div className="card-body">
                  <FaHourglassHalf size={40} className="text-warning mb-2" />
                  <h5 className="card-title">Agendamentos Pendentes</h5>
                  <p className="card-text fs-4">{dados.agendamentoPendentes}</p>
                  <p className="text-muted mb-2">Pendentes</p>
                  <button
                    className="btn btn-outline-warning w-100"
                    onClick={() => navigate("/paciente/agendamentos")}
                  >
                    Acompanhar
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 col-xl-3">
              <div className="card text-center shadow rounded-4">
                <div className="card-body">
                  <FaMoneyBillWave size={40} className="text-success mb-2" />
                  <h5 className="card-title">Pagamentos Pendentes</h5>
                  <p className="card-text fs-4">{dados.pagamentoPendentes}</p>
                  <p className="text-muted mb-2">Aguardando pagamento</p>
                  <button
                    className="btn btn-outline-success w-100"
                    onClick={() => navigate("/paciente/pagamentos")}
                  >
                    Ver pagamentos
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Espaço para recursos futuros */}
        </div>
      </div>
    </div>
  );
}
