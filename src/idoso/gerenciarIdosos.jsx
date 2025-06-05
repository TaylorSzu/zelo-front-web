import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import SidebarContratante from "../utils/sidebarContratante.jsx";
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
        const cadastroSucesso = sessionStorage.getItem('cadastroIdosoSucesso');
        if (cadastroSucesso) {
            toast.success('Idoso cadastrado com sucesso!');
            sessionStorage.removeItem('cadastroIdosoSucesso');
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <SidebarContratante>
            <div className="container-fluid" style={{ minHeight: "100vh", padding: "40px" }}>
                <div className="card shadow-lg rounded-4 border-0">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center rounded-top-4">
                        <h3 className="m-0">Gerenciar Idosos</h3>
                        <button
                            className="btn btn-light"
                            onClick={() => setShowCadastro(true)}
                            style={{ color: '#0d6efd' }}
                        >
                            <i className="bi bi-person-plus"></i> Adicionar idoso
                        </button>
                    </div>

                    <div className="card-body ">
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

                        <div className="row">
                            {idosos.map((idoso) => (
                                <div className="col-md-4 mt-4 mb-4" key={idoso.id}>
                                    <div className="card shadow-sm h-100 rounded-4 border-secondary">
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title text-primary fw-bold">{idoso.nome}</h5>
                                            <p className="card-text mb-3">
                                                <strong>Idade:</strong> {idoso.idade} anos <br />
                                                <strong>Data de Nascimento:</strong> {converterFormatoData(idoso.dataNascimento)} <br />
                                                <strong>Observações Médicas:</strong> {idoso.observacoesMedicas || "Nenhuma"}
                                            </p>
                                            <div className="mt-auto d-flex justify-content-between">
                                                <button
                                                    className="btn btn-secondary w-50 me-2"
                                                    onClick={() => {
                                                        setIdosoSelecionado(idoso.id);
                                                        setShowEditar(true);
                                                    }}
                                                >
                                                    <i className="bi bi-pencil"></i> Editar
                                                </button>
                                                <button
                                                    className="btn btn-danger w-50"
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
            </div>


            {/* Modal de Cadastro */}
            {showCadastro && (
                <CadastroIdoso
                    onConfirmar={() => {
                        setShowCadastro(false);
                        listarIdosos();
                    }}
                    onCancelar={() => setShowCadastro(false)}
                />
            )}

            {/* Modal de Edição */}
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
        </SidebarContratante>
    );
}
