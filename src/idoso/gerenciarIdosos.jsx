import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { converterFormatoData } from "../utils/mascaras.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CadastroIdoso from "../idoso/cadastrarIdoso.jsx";
import EditarIdoso from "../idoso/editarIdoso.jsx";

export default function GerenciarIdosos() {
  const [idosos, setIdosos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCadastro, setShowCadastro] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [idosoSelecionado, setIdosoSelecionado] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    listarIdosos();
    const cadastroSucesso = sessionStorage.getItem("cadastroIdosoSucesso");
    if (cadastroSucesso) {
      toast.success("Idoso cadastrado com sucesso!");
      sessionStorage.removeItem("cadastroIdosoSucesso");
    }
  }, []);

  const listarIdosos = async () => {
    try {
      setLoading(true);
      const contratanteId = sessionStorage.getItem("contratanteId");
      const response = await axios.get(
        `http://localhost:5171/idoso/listar/${contratanteId}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setIdosos(response.data);
      }
    } catch (error) {
      setError("Erro ao listar idosos.");
      console.error("Erro ao listar idosos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (idosoId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5171/idoso/excluir/${idosoId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Idoso excluído com sucesso!");
        listarIdosos();
      } else {
        toast.error("Não foi possível excluir o idoso.");
      }
    } catch (error) {
      setError("Erro ao excluir idoso.");
      console.error("Erro ao excluir idoso:", error);
    }
  };

  return (
    <div
      className="container-fluid"
      style={{ minHeight: "100vh", padding: "40px" }}
    >
      <div className="card shadow-lg rounded-4 border-0">
        <div className="card-header bg-primary text-white rounded-top-4 text-center">
          <h3 className="m-0">Gerenciar Idosos</h3>
        </div>

        <div className="card-body">
          <div className="text-center mb-4">
            <button
              className="btn btn-primary"
              onClick={() => setShowCadastro(true)}
            >
              <i className="bi bi-person-plus"></i> Adicionar idoso
            </button>
          </div>

          {loading && (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="mt-2">Carregando dados...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!loading && idosos.length === 0 && (
            <div className="text-center text-muted">
              <i className="bi bi-person-x fs-1"></i>
              <p className="mt-2">Nenhum idoso cadastrado ainda.</p>
            </div>
          )}

          <div className="row g-3">
            {idosos.map((idoso) => (
              <div className="col-12 col-sm-6 col-lg-4" key={idoso.id}>
                <div className="card shadow-sm h-100 rounded-4 border-secondary">
                  <div
                    className="card-body d-flex flex-column"
                    style={{ padding: "1rem" }}
                  >
                    <h5 className="card-title text-primary fw-bold text-center">
                      {idoso.nome}
                    </h5>

                    <ul className="list-group list-group-flush mb-3">
                      <li className="list-group-item d-flex align-items-center gap-2">
                        <i
                          className="bi bi-calendar-week text-primary"
                          style={{ fontSize: "1.2rem" }}
                        ></i>
                        <strong>Idade:</strong> {idoso.idade} anos
                      </li>
                      <li className="list-group-item d-flex align-items-center gap-2">
                        <i
                          className="bi bi-calendar-date text-info"
                          style={{ fontSize: "1.2rem" }}
                        ></i>
                        <strong>Nascimento:</strong>{" "}
                        {converterFormatoData(idoso.dataNascimento)}
                      </li>
                      <li className="list-group-item d-flex align-items-center gap-2">
                        <i
                          className="bi bi-heart-pulse-fill text-danger"
                          style={{ fontSize: "1.2rem" }}
                        ></i>
                        <strong>Observações:</strong>{" "}
                        {idoso.observacoesMedicas || "Nenhuma"}
                      </li>
                    </ul>

                    <div className="mt-auto d-grid gap-2">
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setIdosoSelecionado(idoso.id);
                          setShowEditar(true);
                        }}
                      >
                        <i className="bi bi-pencil"></i> Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleExcluir(idoso.id)}
                      >
                        <i className="bi bi-trash"></i> Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCadastro && (
        <CadastroIdoso
          onConfirmar={() => {
            setShowCadastro(false);
            listarIdosos();
          }}
          onCancelar={() => setShowCadastro(false)}
        />
      )}

      {showEditar && idosoSelecionado && (
        <EditarIdoso
          id={idosoSelecionado}
          onConfirmar={() => {
            setShowEditar(false);
            setIdosoSelecionado(null);
            listarIdosos();
          }}
          onCancelar={() => {
            setShowEditar(false);
            setIdosoSelecionado(null);
          }}
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
    </div>
  );
}
