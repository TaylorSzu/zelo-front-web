import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Cookies from "js-cookie";
import Mascara from "./utils/mascaras.jsx";

export default function PerfilPaciente() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [endereco, setEndereco] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [necessidades, setNecessidades] = useState("");
    const [metodoPagamento, setMetodoPagamento] = useState("");
    const [foto, setFoto] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
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

            const response = await axios.get("http://localhost:5171/usuario/encontrar", {
                withCredentials: true,
            });

            if (response.status === 200) {
                const userData = response.data;
                setNome(userData.nome);
                setCpf(userData.cpf);
                setEndereco(userData.endereco);
                setTelefone(userData.telefone);
                setEmail(userData.email);

                if (userData.tipoUsuario === "cuidador") {
                    navigate("/cuidador/perfil");
                    return;
                }

                const paciente = userData.Paciente || {};
                setNecessidades(paciente.necessidades || "");
                setMetodoPagamento(paciente.metodoPagamento || "");
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

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const token = Cookies.get("token");

            if (!token) {
                setError("Token de autenticação não encontrado");
                return;
            }

            const response = await axios.put(
                "http://localhost:5171/usuario/atualizar",
                {
                    nome,
                    cpf,
                    endereco,
                    telefone,
                    email,
                    necessidades,
                    metodoPagamento,
                    foto,
                },
                { withCredentials: true }
            );

            if (response.status === 200) {
                setIsEditing(false);
                handleLoad();
            } else {
                setError("Erro ao salvar as alterações.");
            }
        } catch (error) {
            setError("Erro ao salvar as alterações. Tente novamente.");
            console.error("Erro na requisição:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir sua conta?");
        if (confirmDelete) {
            try {
                setLoading(true);
                const token = Cookies.get("token");

                if (!token) {
                    setError("Token de autenticação não encontrado");
                    return;
                }

                const response = await axios.delete("http://localhost:5171/usuario/deletar", {
                    withCredentials: true,
                });

                if (response.status === 200) {
                    navigate("/login");
                } else {
                    setError("Erro ao excluir a conta.");
                }
            } catch (error) {
                setError("Erro ao excluir a conta. Tente novamente.");
                console.error("Erro na requisição:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(URL.createObjectURL(file));
        }
    };

    return (
        <div className="d-flex">
            <div className="top-bar bg-primary text-white p-2 d-flex justify-content-between align-items-center fixed-top w-100">
                <div className="d-flex align-items-center">
                    <img src="/logo.jpg" alt="Logo" height="40" className="me-2" />
                    <span className="fs-4">zElo</span>
                </div>
            </div>

            <div className="sidebar bg-primary text-white p-3 position-fixed" style={{ top: '55px', width: '250px', height: 'calc(100vh - 55px)' }}>
                <h4>Menu</h4>
                <ul className="nav flex-column">
                    <li className="nav-item"><a href="#" className="nav-link text-white">Meus Agendamentos</a></li>
                    <li className="nav-item"><a href="#" className="nav-link text-white">Meus Pagamentos</a></li>
                    <li className="nav-item"><a href="#" className="nav-link text-white">Perfil</a></li>
                    <li className="nav-item"><a href="#" className="nav-link text-white">Suporte</a></li>
                </ul>
            </div>

            <div className="container-fluid" style={{ marginTop: '100px', marginLeft: '270px' }}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card shadow p-4 mb-4">
                            <h2>Perfil do Paciente</h2>
                            {loading && <p>Carregando...</p>}
                            {error && <p className="text-danger">{error}</p>}
                            {!loading && !error && (
                                <div>
                                    <div className="mb-3">
                                        <h5>Foto do Perfil</h5>
                                        <div className="card" style={{ width: "18rem" }}>
                                            <img
                                                src={foto || "/default-avatar.png"}
                                                className="card-img-top"
                                                alt="Foto de perfil"
                                                style={{ height: "200px", objectFit: "cover" }}
                                            />
                                            {isEditing && (
                                                <div className="card-body">
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        onChange={handleFileChange}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label><strong>Nome:</strong></label>
                                        <input
                                            type="text"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            disabled={!isEditing}
                                            className="form-control"
                                        />
                                    </div>
                                    <div>
                                        <label><strong>CPF:</strong></label>
                                        <Mascara
                                            type="cpf"
                                            value={cpf}
                                            onChange={(e) => setCpf(e.target.value)}
                                            placeholder="000.000.000-00"
                                            className="form-control"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <label><strong>Endereço:</strong></label>
                                        <input
                                            type="text"
                                            value={endereco}
                                            onChange={(e) => setEndereco(e.target.value)}
                                            disabled={!isEditing}
                                            className="form-control"
                                        />
                                    </div>
                                    <div>
                                        <label><strong>Telefone:</strong></label>
                                        <Mascara
                                            type="telefone"
                                            value={telefone}
                                            onChange={(e) => setTelefone(e.target.value)}
                                            placeholder="(00) 00000-0000"
                                            className="form-control"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div>
                                        <label><strong>Email:</strong></label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={!isEditing}
                                            className="form-control"
                                        />
                                    </div>
                                    <div>
                                        <label><strong>Necessidades:</strong></label>
                                        <input
                                            type="text"
                                            value={necessidades}
                                            onChange={(e) => setNecessidades(e.target.value)}
                                            disabled={!isEditing}
                                            className="form-control"
                                        />
                                    </div>
                                    <div>
                                        <label><strong>Método de Pagamento:</strong></label>
                                        <input
                                            type="text"
                                            value={metodoPagamento}
                                            onChange={(e) => setMetodoPagamento(e.target.value)}
                                            disabled={!isEditing}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="mt-3">
                                        {isEditing ? (
                                            <button onClick={handleSave} className="btn btn-success">Salvar</button>
                                        ) : (
                                            <button onClick={handleEdit} className="btn btn-primary">Editar</button>
                                        )}
                                        <button onClick={handleDelete} className="btn btn-danger ms-3">Deletar Conta</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card shadow p-4 mb-4">
                            <h2>Informações Adicionais</h2>
                            <div>
                                <label><strong>Plano de Saúde:</strong></label>
                                <input
                                    type="text"
                                    placeholder="Plano de saúde"
                                    className="form-control"
                                />
                            </div>
                            <div className="mt-3">
                                <button className="btn btn-primary">Salvar Informações</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
