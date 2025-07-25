import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Cookies from "js-cookie";
import Mascara, {
  removerMascara,
  removerMascaraDinheiro,
} from "../utils/mascaras.jsx";
import ConfirmarSenha from "../utils/confirmarSenha.jsx";
import CadastrarCuidador from "../cuidador/cadastrarCuidador.jsx";
import { ToastContainer, toast } from "react-toastify";
import DisponibilidadeModal from "../utils/disponibilidade.jsx";
import "react-toastify/dist/ReactToastify.css";

export default function PerfilCuidador() {
  const [id, setId] = useState(null);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("Paciente");
  const [status, setStatus] = useState("Ativo");
  const [disponibilidade, setDisponibilidade] = useState("");
  const [valorHora, setValorHora] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [statusVerificacao, setStatusVerificacao] = useState(false);
  const [foto, setFoto] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [precisaCadastrar, setPrecisaCadastrar] = useState(false);
  const [modalDisponibilidadeAberto, setModalDisponibilidadeAberto] =
    useState(false);

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

        if (!userData.Cuidadores || userData.Cuidadores.length === 0) {
          setPrecisaCadastrar(true);
        } else {
          setId(userData.id);
          setNome(userData.nome);
          setCpf(userData.cpf);
          setEndereco(userData.endereco);
          setTelefone(userData.telefone);
          setEmail(userData.email);
          setSenha(userData.senha);
          setTipoUsuario(userData.tipoUsuario || "Cuidador");
          setStatus(userData.status || "Ativo");
          setDisponibilidade(userData.Cuidadores[0]?.disponibilidade || "");
          const valorDoBanco = parseFloat(userData.Cuidadores[0]?.valorHora);
          const valorFormatado = valorDoBanco.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });
          setValorHora(valorFormatado);
          setEspecialidade(userData.Cuidadores[0]?.especialidade || "");
          setStatusVerificacao(userData.statusVerificacao || false);
          setFoto(userData.foto || null);
          const idCuidador = userData.Cuidadores[0].id;
          sessionStorage.setItem("idCuidador", idCuidador);
          setPrecisaCadastrar(false);

          console.log("valor:", userData.Cuidadores[0].valorHora);
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

  const handleUpdate = async () => {
    try {
      setLoading(true);
      setError("");

      const token = Cookies.get("token");
      const idCuidador = sessionStorage.getItem("idCuidador");

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

      const cuidador = {
        id: idCuidador,
        disponibilidade,
        valorHora: parseFloat(removerMascaraDinheiro(valorHora, "dinheiro")),
        especialidade,
        statusVerificacao,
      };

      const response = await axios.put(
        "http://localhost:5171/usuario/alterar",
        usuario,
        { withCredentials: true }
      );

      const response2 = await axios.put(
        `http://localhost:5171/cuidador/alterar/${idCuidador}`,
        cuidador,
        { withCredentials: true }
      );

      if (response.status === 200 && response2.status === 200) {
        sessionStorage.removeItem("contratanteId");
        toast.success("Perfil atualizado com sucesso!");
        await new Promise((r) => setTimeout(r, 500));
        await handleLoad();
      } else {
        toast.error(
          "Erro ao atualizar perfil. Verifique os dados e tente novamente."
        );
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
        await new Promise((r) => setTimeout(r, 5000));
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

  if (precisaCadastrar) {
    return <CadastrarCuidador onCadastroSucesso={handleLoad} />;
  }

  return (
    <>
      <div className="container py-5 d-flex justify-content-center ">
        <div className="card" style={{ width: "100%", maxWidth: "7680px" }}>
          <div className="card-header bg-primary text-white text-center ">
            <h3>Perfil do Cuidador</h3>
          </div>
          <div className="card-body">
            {loading && <p>Carregando...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <>
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
                      src={foto || "../src/assets/perfil.png"}
                      alt="Foto de perfil"
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                    <label
                      htmlFor="fileInput"
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
                        id="fileInput"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                </div>

                {/* Campos de texto */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>
                      <strong>Nome:</strong>
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>
                      <strong>CPF:</strong>
                    </label>
                    <Mascara
                      type="cpf"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      placeholder="Digite seu CPF"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>
                      <strong>Endereço:</strong>
                    </label>
                    <input
                      type="text"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>
                      <strong>Telefone:</strong>
                    </label>
                    <Mascara
                      type="telefone"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="Digite seu telefone"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>
                      <strong>Email:</strong>
                    </label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="form-control"
                      style={{ backgroundColor: "white" }}
                    />
                  </div>

                  <div className="col-md-6 mb-3 d-flex align-items-end">
                    <button
                      type="button"
                      className="btn btn-outline-primary w-100"
                      onClick={() =>
                        setModalDisponibilidadeAberto(
                          !modalDisponibilidadeAberto
                        )
                      }
                    >
                      {modalDisponibilidadeAberto
                        ? "Fechar Disponibilidade"
                        : "Abrir Disponibilidade"}
                    </button>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>
                      <strong>Valor Diaria:</strong>
                    </label>
                    <Mascara
                      type="dinheiro"
                      value={valorHora}
                      onChange={(e) => setValorHora(e.target.value)}
                      placeholder="Infome o seu valor por diaria"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>
                      <strong>Especialidade:</strong>
                    </label>
                    <input
                      type="text"
                      value={especialidade}
                      onChange={(e) => setEspecialidade(e.target.value)}
                      className="form-control"
                    />
                  </div>
                  <input type="hidden" value={id || ""} />
                  <input type="hidden" value={senha} />
                  <input type="hidden" value={tipoUsuario} />
                  <input type="hidden" value={status} />
                  <input type="hidden" value={statusVerificacao} />
                </div>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-danger" onClick={abrirConfirmacao}>
                    <i className="bi bi-trash-fill me-1"></i>Deletar Conta
                  </button>
                  <button className="btn btn-success" onClick={handleUpdate}>
                    <i className="bi bi-check-circle-fill me-1"></i>Salvar
                    Alterações
                  </button>
                </div>

                {/* Confirmação de Senha */}
                {mostrarConfirmacao && (
                  <ConfirmarSenha
                    onConfirmar={confirmarSenha}
                    onCancelar={fecharConfirmacao}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
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

      {modalDisponibilidadeAberto && (
        <DisponibilidadeModal
          disponibilidadeModal
          onConfirmar={(dados) => {
            setDisponibilidade(dados.disponibilidade);
            setModalDisponibilidadeAberto(false);
          }}
          onCancelar={() => setModalDisponibilidadeAberto(false)}
          setDisponibilidade={setDisponibilidade}
          disponibilidadeAtual={disponibilidade}
        />
      )}
    </>
  );
}
