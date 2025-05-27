import { useState } from "react";
import { Container, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Mascara from "./utils/mascaras.jsx";
import { removerMascara } from "./utils/mascaras.jsx";

export default function Cadastro() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [endereco, setEndereco] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false); // Adicionado o estado de loading
    const navigate = useNavigate(); // Adicionado para o redirecionamento

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação dos campos obrigatórios
        if (!nome || !cpf || !endereco || !telefone || !email || !senha || !tipoUsuario) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const response = await axios.post("https://localhost:5171/usuario/registrar", {
                nome,
                cpf: removerMascara(cpf),
                endereco,
                telefone: removerMascara(telefone),
                email,
                senha,
                tipoUsuario,
                status: "Ativo" // Status fixo
            });

            setError("");
            setSuccess(true);
            console.log("Cadastro realizado com sucesso!", response);

            // Limpar os campos após o cadastro
            setNome("");
            setCpf("");
            setEndereco("");
            setTelefone("");
            setEmail("");
            setSenha("");
            setTipoUsuario("");

            // Ativar o loading antes de redirecionar
            setLoading(true);

            // Redirecionar para a página de login após 20 segundos
            setTimeout(() => {
                setLoading(false); // Desativar o loading
                navigate("/login"); // Redireciona para a página de login
            }, 5000); // 50 segundos

        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            setError("Erro ao realizar o cadastro. Tente novamente.");
        }
    };

    return (
        <Container fluid className="d-flex vh-100 g-0">
            <Col md={6} className="d-flex flex-column justify-content-center align-items-center bg-primary text-white text-center p-5">
                <img
                    src="https://via.placeholder.com/300"
                    alt="Cuidado de idosos"
                    className="img-fluid rounded mb-3"
                    style={{ maxWidth: "80%" }}
                />
                <h4>Cuidando com carinho e dedicação</h4>
                <p>Oferecemos o melhor serviço para garantir o bem-estar dos idosos.</p>
            </Col>
            <Col md={6} className="d-flex flex-column justify-content-center align-items-center p-4">
                <Card className="p-4 shadow-lg w-100">
                    <h3 className="text-center text-primary">Cadastro</h3>

                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">Cadastro realizado com sucesso!</Alert>}

                    {/* Mostrar o spinner de loading enquanto está aguardando o redirecionamento */}
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <p>Aguarde, redirecionando...</p>
                        </div>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Digite seu nome"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>CPF</Form.Label>
                                <Mascara
                                    type="cpf"
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                    placeholder="Digite seu CPF"
                                    className="form-control"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Endereço</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={endereco}
                                    onChange={(e) => setEndereco(e.target.value)}
                                    placeholder="Digite seu endereço"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Telefone</Form.Label>
                                <Mascara
                                    type="telefone"
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                    placeholder="Digite seu telefone"
                                    className="form-control"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Digite seu e-mail"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="Digite sua senha"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Tipo de Usuário</Form.Label>
                                <Form.Select value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
                                    <option value="">Selecione...</option>
                                    <option value="Cuidador">Cuidador</option>
                                    <option value="Paciente">Paciente</option>
                                </Form.Select>
                            </Form.Group>

                            <Button type="submit" className="w-100" variant="success">Cadastrar</Button>
                        </Form>
                    )}

                    <p className="mt-3 text-center">
                        Já tem uma conta? <Link to="/login">Faça login</Link>
                    </p>
                </Card>
            </Col>
        </Container>
    );
}
