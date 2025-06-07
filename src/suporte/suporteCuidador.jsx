import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SidebarCuidador from "../utils/sidebarCuidador.jsx";
import axios from "axios"


const SupportPage = () => {
  const [form, setForm] = useState({
    userEmail: "",
    titulo: "",
    conteudo: "",
    userName: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     try {
    await axios.post("http://localhost:5171/suporte/enviar", {
      userEmail: form.userEmail,
      titulo: form.titulo,
      conteudo: form.conteudo,
      userName: form.userName
    });

    setForm({ userEmail: "", titulo: "", conteudo: "",  userName: ""});
  } catch (error) {
    console.error("Erro ao enviar chamado:", error);
    alert("Erro ao enviar chamado. Verifique o servidor.");
  }
};

  return (
    <SidebarCuidador>
      <div className="container mt-5">
        <div className="card shadow border-0">
          <div
            className="card-header text-white"
            style={{ backgroundColor: "#0A68FF" }}
          >
            <h4 className="mb-0 text-center">Central de Suporte</h4>
          </div>
          <div className="card-body">
            <p className="text-muted mb-4">
              Se você está enfrentando algum problema ou tem alguma dúvida, preencha o formulário abaixo. Nossa equipe responderá o mais breve possível.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label fw-semibold">
                    Nome:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="userName"
                    value={form.userName}
                    onChange={handleChange}
                    placeholder="Digite seu nome completo"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email:
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="userEmail"
                    value={form.userEmail}
                    onChange={handleChange}
                    placeholder="seuemail@exemplo.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="title" className="form-label fw-semibold">
                  Título da Chamada:
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="titulo"
                  value={form.titulo}
                  onChange={handleChange}
                  placeholder="Ex.: Problema com agendamento"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="message" className="form-label fw-semibold">
                  Descreva sua solicitação:
                </label>
                <textarea
                  className="form-control"
                  name="conteudo"
                  rows="6"
                  value={form.conteudo}
                  onChange={handleChange}
                  placeholder="Descreva com detalhes seu problema, dúvida ou sugestão..."
                  required
                />
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ backgroundColor: "#0A68FF", border: "none" }}
                >
                  Enviar Chamado
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SidebarCuidador>
  );
};

export default SupportPage;