import axios from "axios";
axios.defaults.withCredentials = true; 
import { useState } from "react";
import {
  Container,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError("");

    axios
      .post("https://localhost:5171/usuario/login", { email, senha })
      .then((response) => {
        const { token, usuario } = response.data;

        if (!usuario || !usuario.tipoUsuario) {
          setError("Erro ao identificar o tipo de usuário.");
          return;
        }

        // Salvar token no cookie
        Cookies.set("token", token, { expires: 7 });

        // Redirecionar com base no tipo de usuário (usando if/else como solicitado)
        if (usuario.tipoUsuario === "Cuidador") {
          navigate("/cuidador");
        } else if (usuario.tipoUsuario === "Paciente") {
          navigate("/paciente");
        } else {
          setError("Tipo de usuário não reconhecido.");
        }
      })
      .catch((error) => {
        setError("E-mail ou senha incorretos.");
        console.error("Erro durante login:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container fluid className="d-flex vh-100 g-0">
      <Col
        md={6}
        className="d-flex flex-column justify-content-center align-items-center p-4"
      >
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
              disabled={loading}
            >
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
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
      <Col
        md={6}
        className="d-flex flex-column justify-content-center align-items-center bg-primary text-white text-center p-5"
      >
        <img
          src="" // Adicione a imagem aqui
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
