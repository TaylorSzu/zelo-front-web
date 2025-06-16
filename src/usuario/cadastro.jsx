import { useState } from "react";
import {
  Container,
  Col,
  Row,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Mascara from "../utils/mascaras.jsx";
import { removerMascara } from "../utils/mascaras.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // ÍCONES

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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // CONTROLE DO OLHINHO

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !nome ||
      !cpf ||
      !endereco ||
      !telefone ||
      !email ||
      !senha ||
      !tipoUsuario
    ) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5171/usuario/registrar",
        {
          nome,
          cpf: removerMascara(cpf),
          endereco,
          telefone: removerMascara(telefone),
          email,
          senha,
          tipoUsuario,
          status: "Ativo",
        }
      );

      setError("");
      setSuccess(true);
      setNome("");
      setCpf("");
      setEndereco("");
      setTelefone("");
      setEmail("");
      setSenha("");
      setTipoUsuario("");
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 5000);
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setError("Erro ao realizar o cadastro. Tente novamente.");
    }
  };

  return (
    <Container fluid>
      <Row className="g-0 flex-column flex-md-row min-vh-100">
        <Col
          xs={12}
          md={6}
          className="d-flex flex-column justify-content-center align-items-center bg-primary text-white text-center p-4 order-1 order-md-2"
        >
          <img
            src="img/ICON1.png"
            alt="Cadastro"
            className="img-fluid rounded mb-3"
            style={{ maxWidth: "80%", height: "100px" }}
          />
          <h4>Cuidando com carinho e dedicação</h4>
          <p>
            Oferecemos o melhor serviço para garantir o bem-estar dos idosos.
          </p>
        </Col>

        <Col
          xs={12}
          md={6}
          className="d-flex justify-content-center align-items-center p-4 order-2 order-md-1 bg-light text-dark"
        >
          <Card
            className="p-4 shadow-lg w-100"
            style={{ maxWidth: "500px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <h3 className="text-center text-primary">Cadastro</h3>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && (
              <Alert variant="success">Cadastro realizado com sucesso!</Alert>
            )}

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
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Digite sua senha"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#6c757d",
                      }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Usuário</Form.Label>
                  <Form.Select
                    value={tipoUsuario}
                    onChange={(e) => setTipoUsuario(e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    <option value="Cuidador">Cuidador</option>
                    <option value="Paciente">Paciente</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-flex gap-2 mt-3">
                  <Button type="submit" className="w-50" variant="success">
                    Cadastrar
                  </Button>
                  <Button
                    type="button"
                    className="w-50"
                    variant="danger"
                    onClick={() => navigate("/home")}
                  >
                    Voltar
                  </Button>
                </div>
              </Form>
            )}

            <p className="mt-3 text-center">
              Já tem uma conta? <Link to="/login">Faça login</Link>
            </p>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
