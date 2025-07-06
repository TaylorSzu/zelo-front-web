import axios from "axios";
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

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRecuperar = async (e) => {
    e.preventDefault();

    if (!email) {
      setErro("Por favor, informe seu e-mail.");
      return;
    }

    setLoading(true);
    setErro("");
    setMensagem("");

    try {
      const response = await axios.post(
        "http://localhost:5171/usuario/recuperarSenha",
        { email }
      );

      // Mensagem padrão, mesmo se e-mail não existir (por segurança)
      setMensagem(
        "Se o e-mail estiver cadastrado, enviaremos instruções para recuperação."
      );
    } catch (err) {
      console.error("Erro na recuperação de senha:", err);
      setErro("Erro ao tentar recuperar a senha. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <Row className="g-0 flex-column flex-md-row min-vh-100">
        {/* Lado esquerdo - imagem e texto */}
        <Col
          xs={12}
          md={6}
          className="d-flex flex-column justify-content-center align-items-center bg-primary text-white text-center p-4 order-1 order-md-2"
        >
          <img
            src="img/ICON1.png"
            alt="Recuperar Senha"
            className="img-fluid rounded mb-3 shadow-sm"
            style={{ maxWidth: "80%", height: "100px" }}
          />
          <h4 className="fw-bold">Esqueceu sua senha?</h4>
          <p className="px-2">Informe seu e-mail para redefinir a senha.</p>
        </Col>

        {/* Lado direito - formulário */}
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
            <h3 className="text-center text-primary">Recuperar Senha</h3>

            {erro && <Alert variant="danger">{erro}</Alert>}
            {mensagem && <Alert variant="success">{mensagem}</Alert>}

            <Form onSubmit={handleRecuperar}>
              <Form.Group className="mb-3">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                className="w-100"
                variant="primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Enviando...
                  </>
                ) : (
                  "Enviar instruções para recuperação de senha."
                )}
              </Button>
            </Form>

            <p className="mt-3 text-center">
              Lembrou sua senha? <Link to="/login">Voltar ao login</Link>
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
