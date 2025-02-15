import { useState } from "react";
import { Container, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Cadastro() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [endereco, setEndereco] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nome || !cpf || !endereco || !telefone || !email || !senha || !tipoUsuario || !status) {
            setError("Por favor, preencha todos os campos.");
            return;
        }
        setStatus("Ativo");
        setError("");
        console.log("Cadastro realizado com sucesso!");
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
                            <Form.Control 
                                type="text"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                placeholder="Digite seu CPF"
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
                            <Form.Control 
                                type="text"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                placeholder="Digite seu telefone"
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

                        <Form.Control type="hidden" value={status} />

                        <Button type="submit" className="w-100" variant="success">Cadastrar</Button>
                    </Form>

                    <p className="mt-3 text-center">
                        Já tem uma conta? <Link to="/login">Faça login</Link>
                    </p>
                </Card>
            </Col>
        </Container>
    );
}
