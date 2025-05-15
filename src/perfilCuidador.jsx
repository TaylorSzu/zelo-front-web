import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Cookies from "js-cookie";
import SidebarCuidador from "./utils/sidebarCuidador.jsx";
import Mascara from "./utils/mascaras.jsx";
import ConfirmarSenha from "./utils/confirmarSenha.jsx";

export default function PerfilCuidador() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [disponibilidade, setDisponibilidade] = useState("");
  const [valorHora, setValorHora] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [foto, setFoto] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    handleLoad();
  }, []);

  const handleLoad = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");

      if (!token) {
        setError("Token de autenticação não encontrado");
        return;
      }

      const response = await axios.get(
        "https://127.0.0.1/usuario/encontrar",
        { withCredentials: true }
      );

      if (response.status === 200) {
        const userData = response.data;
        setNome(userData.nome);
        setCpf(userData.cpf);
        setEndereco(userData.endereco);
        setTelefone(userData.telefone);
        setEmail(userData.email);
        setDisponibilidade(userData.Cuidadores[0]?.disponibilidade || "");
        setValorHora(userData.Cuidadores[0]?.valorHora || "");
        setEspecialidade(userData.Cuidadores[0]?.especialidade || "");
        setFoto(userData.foto || null);
      } else {
        setError("Erro ao recuperar os dados.");
      }
    } catch (error) {
      setError("Erro ao carregar perfil. Tente novamente.");
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(URL.createObjectURL(file));
    }
  };

  const abrirConfirmacao = () => {
    setMostrarConfirmacao(true);
  };

  const fecharConfirmacao = () => {
    setMostrarConfirmacao(false);
  };

  const confirmarSenha = () => {
    console.log("Senha confirmada!");
    fecharConfirmacao();
    // Aqui você pode seguir com a ação de deletar ou atualizar
  };

  return (
    <SidebarCuidador>
      <div
        className="container-fluid d-flex flex-column align-items-center"
        style={{
          minHeight: "100%",
          backgroundColor: "#f8f9fa",
          padding: "30px",
        }}
      >
        <div
          className="card shadow-lg p-4"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <div className="card-header bg-primary text-white text-center">
            <h3>Perfil do Cuidador</h3>
          </div>
          <div className="card-body">
            {loading && <p>Carregando...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <div>
                {/* Imagem de perfil */}
                <div className="mb-4 text-center">
                  <h5>Imagem de Perfil</h5>
                  <div
                    className="position-relative mx-auto"
                    style={{ width: "150px", height: "150px" }}
                  >
                    <div
                      className="rounded-circle overflow-hidden border border-2 position-relative"
                      style={{
                        width: "150px",
                        height: "150px",
                        backgroundColor: "#dee2e6",
                      }}
                    >
                      <img
                        src={foto || "../src/assets/perfil.png"}
                        alt="Foto de perfil"
                        className="w-100 h-100"
                        style={{ objectFit: "cover", borderRadius: "50%" }}
                      />
                      <label
                        htmlFor="fileInput"
                        className="position-absolute top-0 start-0 d-flex align-items-center justify-content-center text-white fw-bold"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          cursor: "pointer",
                          opacity: 0,
                          transition: "opacity 0.3s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
                      >
                        Alterar
                        <input
                          type="file"
                          id="fileInput"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Campos de texto */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label><strong>Nome:</strong></label>
                    <input type="text" value={nome} className="form-control" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><strong>CPF:</strong></label>
                    <Mascara type="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="Digite seu CPF" className="form-control"/>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><strong>Endereço:</strong></label>
                    <input type="text" value={endereco} className="form-control" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><strong>Telefone:</strong></label>
                    <Mascara type="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)}  placeholder="Digite seu telefone" className="form-control"/>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><strong>Email:</strong></label>
                    <input type="email" value={email} disabled className="form-control" style={{ backgroundColor : "white" }} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><strong>Disponibilidade:</strong></label>
                    <input type="text" value={disponibilidade} onChange={(e) => setDisponibilidade(e.target.value)} className="form-control" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><strong>Valor Hora:</strong></label>
                    <input type="text" value={valorHora} onChange={(e) => setValorHora(e.target.value)} className="form-control" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><strong>Especialidade:</strong></label>
                    <input type="text" value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} className="form-control" />
                  </div>
                </div>

                {/* Botões */}
                <div className="text-center mt-4">
                  <button className="btn btn-danger" onClick={abrirConfirmacao}>
                    Deletar Conta
                  </button>
                  <button className="btn btn-primary ms-2" onClick={abrirConfirmacao}>
                    Salvar Alterações
                  </button>
                </div>

                {/* Confirmação de Senha */}
                {mostrarConfirmacao && (
                  <ConfirmarSenha
                    onConfirmar={confirmarSenha}
                    onCancelar={fecharConfirmacao}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarCuidador>
  );
}
