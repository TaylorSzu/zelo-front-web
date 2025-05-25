import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import SidebarContratante from "../utils/sidebarContratante.jsx";
import axios from "axios";
import { converterFormatoData } from "../utils/mascaras.jsx";
import { ToastContainer, toast } from 'react-toastify';
export default function GerenciarIdosos() {
    const [idosos, setIdosos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        listarIdosos();
    }, []);

    const navigate = useNavigate();

    const listarIdosos = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                "http://localhost:5171/idoso/listar",
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
    }

    const handleExcluir = async (idosoId) => {
        try {
            console.log("id:", idosoId);
            const response = await axios.delete(
                `http://localhost:5171/idoso/excluir/${idosoId}`,
                { withCredentials: true }
            );

            if (response.status === 200) {
                toast.success("Idoso excluído com sucesso!");
                listarIdosos(); // Atualiza a lista após excluir
            } else {
                toast.error("Não foi possível excluir o idoso.");
            }
        } catch (error) {
            setError("Erro ao excluir idoso.");
            console.error("Erro ao excluir idoso:", error);
        } finally {
            setLoading(false);
        }
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
                        <h3>Gerenciar Idosos</h3>
                    </div>
                    <div className="card-body">
                        {loading && <p>Carregando...</p>}
                        {error && <p className="text-danger">{error}</p>}
                        {!loading && (
                            <div>
                                {/* botão de cadastrar */}
                                <div className="mt-5">
                                    <button className="btn btn-primary">
                                        <i className="bi bi-person-plus m-2"></i>
                                        Adicionar idoso
                                    </button>
                                </div>
                                <div className="row mt-5">
                                    {idosos.map((idoso) => (
                                        <div className="col-md-4 mb-4" key={idoso.id}>
                                            <div className="card shadow">
                                                <div className="card-body">
                                                    <h5 className="card-title">{idoso.nome}</h5>
                                                    <p className="card-text">
                                                        <strong>Idade:</strong> {idoso.idade} anos
                                                        <br />
                                                        <strong>Data de Nascimento:</strong> {converterFormatoData(idoso.dataNascimento)}
                                                        <br />
                                                        <strong>Observações Médicas:</strong> {idoso.observacoesMedicas}
                                                    </p>
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <button className="btn btn-secondary">
                                                            <i className="bi bi-pencil"></i> Editar
                                                        </button>
                                                        <button className="btn btn-danger" onClick={() => handleExcluir(idoso.id)}>
                                                            <i className="bi bi-trash"></i> Excluir
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
        </SidebarContratante>
    );
}
