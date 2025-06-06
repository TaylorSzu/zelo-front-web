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
  Row,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const loginResponse = await axios.post(
        "http://localhost:5171/usuario/login",
        {
          email,
          senha,
        }
      );
      const { token, usuario } = loginResponse.data;

      if (!usuario || !usuario.tipoUsuario) {
        setError("Erro ao identificar o tipo de usuário.");
        return;
      }

      Cookies.set("token", token, { expires: 7 });

      const response2 = await axios.get(
        "http://localhost:5171/usuario/encontrar",
        {
          withCredentials: true,
        }
      );

      const usuarioEncontrado = response2.data;

      if (usuario.tipoUsuario.toLowerCase() === "cuidador") {
        if (usuarioEncontrado.Cuidadores?.length > 0) {
          const cuidadorId = usuarioEncontrado.Cuidadores[0].id;
          sessionStorage.setItem("cuidadorId", cuidadorId);
        }
        navigate("/cuidador");
      } else if (usuario.tipoUsuario.toLowerCase() === "paciente") {
        if (usuarioEncontrado.Contratantes?.length > 0) {
          const contratanteId = usuarioEncontrado.Contratantes[0].id;
          sessionStorage.setItem("contratanteId", contratanteId);
        }
        navigate("/paciente");
      } else {
        setError("Tipo de usuário não reconhecido.");
      }
    } catch (error) {
      setError("E-mail ou senha incorretos.");
      console.error("Erro durante login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row className="g-0 flex-column flex-md-row min-vh-100">
        {/* Coluna da imagem - em cima em telas pequenas */}
        <Col
          xs={12}
          md={6}
          className="d-flex flex-column justify-content-center align-items-center bg-primary text-white text-center p-4 order-1 order-md-2"
        >
          <img
            src="img/ICON1.png"
            alt="Login"
            className="img-fluid rounded mb-3 shadow-sm"
            style={{ maxWidth: "80%", height: "auto" }}
          />
          <h4 className="fw-bold">Bem-vindo de volta!</h4>
          <p className="px-2">
            Entre para acessar sua conta e gerenciar seus serviços.
          </p>
        </Col>

        {/* Coluna do formulário - embaixo em telas pequenas */}
        <Col
          xs={12}
          md={6}
          className="d-flex justify-content-center align-items-center p-4 order-2 order-md-1 bg-light text-dark"
        >
          <Card
            className="p-4 shadow-lg w-100"
            style={{
              maxWidth: "450px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
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

              <div className="d-flex gap-2 mt-3">
                <Button
                  type="submit"
                  className="w-50"
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
                <Button
                  type="button"
                  className="w-50"
                  variant="danger"
                  onClick={() => navigate("/home")}
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
                    "Voltar"
                  )}
                </Button>
              </div>
            </Form>

            <p className="mt-3 text-center">
              Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
            </p>
            <p className="mt-3 text-center">
              <Link to="/recuperarSenha">Esqueceu sua senha?</Link>
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
