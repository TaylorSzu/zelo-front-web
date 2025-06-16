import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie"; // lembre de instalar com npm install js-cookie
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
import { FaEye, FaEyeSlash } from "react-icons/fa";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function RedefinirSenha() {
  const query = useQuery();
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // Captura o token da URL e salva no cookie assim que o componente carrega
  useEffect(() => {
    const tokenUrl = query.get("token");
    if (tokenUrl) {
      setToken(tokenUrl);
      Cookies.set("token", tokenUrl, { expires: 0.01, sameSite: "Strict" });
    }
  }, [query]);

  const handleRedefinir = async (e) => {
    e.preventDefault();

    if (!senha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setErro("");
    setMensagem("");

    try {
      // Envia só a nova senha, token vai pelo cookie
      await axios.post(
        "http://localhost:5171/usuario/registrarNovaSenha",
        { novaSenha: senha },
        { withCredentials: true } // Importante para enviar cookie
      );

      setMensagem("Senha redefinida com sucesso! Redirecionando...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Erro:", err);
      setErro(
        err.response?.data?.msg || "Erro ao redefinir a senha. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      {/* Seu layout permanece igual */}
      <Row className="g-0 flex-column flex-md-row min-vh-100">
        <Col
          xs={12}
          md={6}
          className="d-flex flex-column justify-content-center align-items-center bg-primary text-white text-center p-4 order-1 order-md-2"
        >
          <img
            src="/img/ICON1.png"
            alt="Redefinir Senha"
            className="img-fluid rounded mb-3 shadow-sm"
            style={{ maxWidth: "80%", height: "100px" }}
          />
          <h4 className="fw-bold">Nova senha</h4>
          <p className="px-2">
            Digite e confirme sua nova senha para continuar
          </p>
        </Col>

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
            <h3 className="text-center text-primary">Redefinir Senha</h3>

            {erro && <Alert variant="danger">{erro}</Alert>}
            {mensagem && <Alert variant="success">{mensagem}</Alert>}

            <Form onSubmit={handleRedefinir}>
              <Form.Group className="mb-3">
                <Form.Label>Nova Senha</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={mostrarSenha ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite a nova senha"
                    required
                  />
                  <span
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#6c757d",
                    }}
                  >
                    {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirmar Nova Senha</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={mostrarConfirmar ? "text" : "password"}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Confirme a nova senha"
                    required
                  />
                  <span
                    onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#6c757d",
                    }}
                  >
                    {mostrarConfirmar ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
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
                    Redefinindo...
                  </>
                ) : (
                  "Redefinir Senha"
                )}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
