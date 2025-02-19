import axios from "axios";
import { useState } from "react";
import { Container, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"; // Adicionando o useNavigate

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Estado de loading
    const navigate = useNavigate(); // Inicializando o hook de navegação

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email || !senha) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        // Iniciar o loading
        setLoading(true);
        setError(""); // Limpar erros anteriores

        axios.post("http://localhost:5171/usuario/login", {
            email,
            senha
        }).then((response) => {
            // Sucesso no login
            console.log(response.data);
            
            // Redirecionar após login bem-sucedido
            navigate("/dashboard"); // Ajuste a rota conforme necessário
        }).catch((error) => {
            // Erro no login
            setError("E-mail ou senha incorretos.");
            console.error(error);
        }).finally(() => {
            // Finalizar o loading
            setLoading(false);
        });
    };

    return (
        <Container fluid className="d-flex vh-100 g-0">
            <Col md={6} className="d-flex flex-column justify-content-center align-items-center p-4">
                <Card className="p-5 shadow-lg w-100 h-100 justify-content-center">
                    <h3 className="text-center text-primary">Login</h3>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
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

                        <Button 
                            type="submit" 
                            className="w-100" 
                            variant="success"
                            disabled={loading} // Desabilitar o botão enquanto estiver carregando
                        >
                            {loading ? (
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            ) : (
                                "Entrar"
                            )}
                        </Button>
                    </Form>

                    <p className="mt-3 text-center">
                        Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
                    </p>
                </Card>
            </Col>
            <Col md={6} className="d-flex flex-column justify-content-center align-items-center bg-primary text-white text-center p-5">
                <img 
                    src="" // Adicione a imagem que você deseja exibir
                    alt="Login"
                    className="img-fluid rounded mb-3"
                    style={{ maxWidth: "80%" }}
                />
                <h4>Bem-vindo de volta!</h4>
                <p>Entre para acessar sua conta e gerenciar seus serviços.</p>
            </Col>
        </Container>
    );
}
