import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Cookies from "js-cookie";
import Mascara from "./utils/mascaras.jsx";

export default function PerfilCuidador() {
  const [userId, setUserId] = useState(null);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [disponibilidade, setDisponibilidade] = useState("");
  const [valorHora, setValorHora] = useState("");
  const [valorPeriodo, setValorPeriodo] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [statusVerificacao, setStatusVerificacao] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

      const response = await axios.get("http://localhost:5171/usuario/encontrar", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.status === 200) {
        const userData = response.data;
        if (userData.tipoUsuario != "Cuidador") {
          window.location.href = "/paciente";
          return;
        }
        setUserId(userData.id)
        setNome(userData.nome);
        setCpf(userData.cpf);
        setEndereco(userData.endereco);
        setTelefone(userData.telefone);
        setEmail(userData.email);
        setStatus(userData.status);

        // Verifica se a chave 'Cuidadores' existe e é um array
        const cuidadores = Array.isArray(userData.Cuidadores) ? userData.Cuidadores : [];

        if (cuidadores.length > 0) {
          // Se houver cuidadores, preenche os dados do cuidador
          setDisponibilidade(cuidadores[0].disponibilidade);
          setValorHora(cuidadores[0].valorHora);
          setValorPeriodo(cuidadores[0].valorPeriodo);
          setEspecialidade(cuidadores[0].especialidade);
          setStatusVerificacao(cuidadores[0].statusVerificacao);
        } else {
          setShowModal(true); // Se não houver cuidadores, exibe o modal
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const token = Cookies.get("token");

      if (!token) {
        setError("Token de autenticação não encontrado");
        return;
      }

      const response = await axios.post("http://localhost:5171/cuidador/cadastrar", {
        usuarioId: userId,
        disponibilidade: disponibilidade,
        valorHora: valorHora,
        valorPeriodo: valorPeriodo,
        especialidade: especialidade,
        statusVerificacao: statusVerificacao,
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.status === 200) {
        setShowModal(false); // Fechar o modal ao salvar os dados
        alert("Cuidador cadastrado com sucesso!");
      }
    } catch (error) {
      setError("Erro ao cadastrar cuidador. Tente novamente.");
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="top-bar bg-primary text-white p-2 d-flex justify-content-between align-items-center fixed-top">
        <div className="d-flex align-items-center">
          <img src="/logo.jpg" alt="Logo" height="40" className="me-2" />
          <span className="fs-4">zElo</span>
        </div>
      </div>

      <div className="sidebar bg-primary text-white p-3 position-fixed" style={{ top: 55, width: 250, height: "100vh" }}>
        <h4>Menu</h4>
        <ul className="nav flex-column">
          <li className="nav-item"><a href="#" className="nav-link text-white">Meus Agendamentos</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Meus Pagamentos</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Perfil</a></li>
          <li className="nav-item"><a href="#" className="nav-link text-white">Suporte</a></li>
        </ul>
      </div>

      <div className="container" style={{ marginLeft: 320, padding: "80px 20px" }}>
        <h2 className="mb-4">Perfil do Cuidador</h2>

        <div className="row">
          <div className="col-md-6">
            <div className="card shadow p-4 mb-4">
              <h4 className="card-title text-primary">Dados Pessoais</h4>
              <div className="mb-3"><label className="form-label">Nome</label><input type="text" className="form-control" value={nome} disabled /></div>
              <div className="mb-3"><label className="form-label">CPF</label><Mascara type="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} className="form-control" /></div>
              <div className="mb-3"><label className="form-label">Endereço</label><input type="text" className="form-control" value={endereco} disabled /></div>
              <div className="mb-3"><label className="form-label">Telefone</label><Mascara type="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="form-control" /></div>
              <div className="mb-3"><label className="form-label">Email</label><input type="email" className="form-control" value={email} disabled /></div>
              <div className="mb-3"><label className="form-label">Status</label><input type="text" className="form-control" value={status} disabled /></div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow p-4 mb-4">
              <h4 className="card-title text-primary">Informações Profissionais</h4>
              <div className="mb-3"><label className="form-label">Disponibilidade</label><input type="text" className="form-control" value={disponibilidade} disabled /></div>
              <div className="mb-3"><label className="form-label">Valor por Hora</label>
              <Mascara
                type="dinheiro"
                value={valorHora}
                onChange={(e) => setValorHora(e.target.value)}
                className="form-control"
              />
              </div>
              <div className="mb-3"><label className="form-label">Valor por Período</label>
                <Mascara
                  type="dinheiro"
                  value={valorPeriodo}
                  onChange={(e) => setValorPeriodo(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="mb-3"><label className="form-label">Especialidade</label><input type="text" className="form-control" value={especialidade} disabled /></div>
              <div className="mb-3"><label className="form-label">Status de Verificação</label><input type="text" className="form-control" value={statusVerificacao} disabled /></div>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ width: "500px", padding: "20px" }}>
            <h3 style={{ marginBottom: "40px" }}>Cadastrar Cuidador</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3"><label className="form-label">Especialidade</label><input type="text" className="form-control" value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} required /></div>
              <div className="mb-3"><label className="form-label">Disponibilidade</label><input type="text" className="form-control" value={disponibilidade} onChange={(e) => setDisponibilidade(e.target.value)} required /></div>
              <div className="mb-3"><label className="form-label">Valor por Hora</label><input type="number" className="form-control" value={valorHora} onChange={(e) => setValorHora(e.target.value)} required /></div>
              <div className="mb-3"><label className="form-label">Valor por Período</label><input type="number" className="form-control" value={valorPeriodo} onChange={(e) => setValorPeriodo(e.target.value)} required /></div>
              <button type="submit" className="btn btn-primary" style={{ marginRight: "10px" }}>Cadastrar</button>
            </form>
          </div>  
        </div>
      )}

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1060; /* Modal acima do conteúdo */
        }

        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          width: 400px;
          z-index: 1070; /* Modal tem um z-index ainda maior */
        }
      `}</style>
    </div>
  );
}
