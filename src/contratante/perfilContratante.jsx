import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
axios.defaults.withCredentials = true;
import Cookies from "js-cookie";
import SidebarContratante from "../utils/sidebarContratante.jsx";
import Mascara, { removerMascara } from "../utils/mascaras.jsx";
import CadastrarContratante from "./cadastrarContratante.jsx";
import ConfirmarSenha from "../utils/confirmarSenha.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PerfilPaciente() {
  const [id, setId] = useState(null);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [necessidades, setNecessidades] = useState("");
  const [foto, setFoto] = useState(null);
  const [senha, setSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("Paciente");
  const [status, setStatus] = useState("Ativo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [precisaCadastrarContratante, setPrecisaCadastrarContratante] = useState(false);

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
        "http://localhost:5171/usuario/encontrar",
        { withCredentials: true }
      );

      if (response.status === 200) {
        const userData = response.data;
        setId(userData.id);
        setNome(userData.nome);
        setCpf(userData.cpf);
        setEndereco(userData.endereco);
        setTelefone(userData.telefone);
        setEmail(userData.email);
        setFoto(userData.foto || null);
        setTipoUsuario(userData.tipoUsuario || "Paciente");
        setStatus(userData.status || "Ativo");
        setSenha(userData.senha);

        if (!userData.Contratantes || userData.Contratantes.length === 0) {
          setPrecisaCadastrarContratante(true);
        } else {
          const contratanteId = userData.Contratantes[0].id;
          sessionStorage.setItem("contratanteId", contratanteId);
          setNecessidades(userData.Contratantes[0].necessidades || "");
          setPrecisaCadastrarContratante(false);
        }
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

  const confirmarSenha = async (senhaDigitada) => {
    try {
      const response = await axios.delete(
        `http://localhost:5171/usuario/excluir/${senhaDigitada}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Perfil atualizado com sucesso!");
        await new Promise((r) => setTimeout(r, 5000 ));
        Cookies.remove("token");
        navigate("/login");
      } else {
        toast.error("Não foi possível deletar a conta.");
      }
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      alert(
        error.response?.data?.mensagem ||
        "Erro ao deletar conta. Verifique a senha e tente novamente."
      );
    } finally {
      fecharConfirmacao();
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");

      const token = Cookies.get("token");

      if (!token) {
        setError("Token de autenticação não encontrado");
        setLoading(false);
        return;
      }

      const usuario = {
        id,
        nome,
        cpf: removerMascara(cpf),
        endereco,
        telefone: removerMascara(telefone),
        email,
        senha,
        tipoUsuario,
        status,
      };

      const contratanteId = sessionStorage.getItem("contratanteId");

      const response = await axios.put(
        "http://localhost:5171/usuario/alterar",
        usuario,
        { withCredentials: true }
      );

      console.log("Resposta da API:", contratanteId, necessidades);

      const response2 = await axios.put(
        `http://localhost:5171/contratante/alterar/${contratanteId}`,
        { necessidades: necessidades },
        { withCredentials: true }
      );

      if (response.status === 200 && response2.status === 200) {
        sessionStorage.removeItem("contratanteId");
        toast.success("Perfil atualizado com sucesso!");
        await new Promise((r) => setTimeout(r, 500));
        await handleLoad();
      } else {
        toast.error("Erro ao atualizar perfil. Verifique os dados e tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error(
        error.response?.data?.mensagem ||
        "Erro ao atualizar perfil. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  if (precisaCadastrarContratante) {
    return <CadastrarContratante onCadastroConcluido={() => setPrecisaCadastrarContratante(false)} />;
  }

  return (
    <SidebarContratante>
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
            <h3>Perfil do Paciente</h3>
          </div>
          <div className="card-body">
            {loading && <p>Carregando...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <div>
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

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label><strong>Nome:</strong></label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><strong>CPF:</strong></label>
                    <Mascara
                      type="cpf"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      placeholder="Digite seu CPF"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><strong>Endereço:</strong></label>
                    <input
                      type="text"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><strong>Telefone:</strong></label>
                    <Mascara
                      type="telefone"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="Digite seu telefone"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><strong>Email:</strong></label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="form-control"
                      style={{ backgroundColor: "white" }}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label><strong>Necessidades:</strong></label>
                    <input
                      type="text"
                      value={necessidades}
                      onChange={(e) => setNecessidades(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <input type="hidden" value={id || ""} />
                  <input type="hidden" value={senha} />
                  <input type="hidden" value={tipoUsuario} />
                  <input type="hidden" value={status} />
                </div>

                <div className="d-flex align-items-center justify-content-center">
                  <button
                    className="btn btn-danger m-3"
                    onClick={abrirConfirmacao}
                  >
                    Deletar Conta
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdate}
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {mostrarConfirmacao && (
        <ConfirmarSenha
          onConfirmar={confirmarSenha}
          onFechar={fecharConfirmacao}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </SidebarContratante>
  );
}