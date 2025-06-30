import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AcessibilidadeContext } from "../context/acessibilidadeContext";

const ModalAvaliacao = ({ show, onClose, evento }) => {
  const { modoEscuro, tamanhoFonte } = useContext(AcessibilidadeContext);
  const [estrelas, setEstrelas] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show || !evento) return null;

  const agendamentoId = evento.agendamentoId ?? evento.id;
  const cuidadorId = evento.cuidadorId ?? evento.id;

  const enviarAvaliacao = async () => {
    try {
      setLoading(true);
      const contratanteId = Number(sessionStorage.getItem("contratanteId"));

      await axios.post("http://localhost:5171/avaliacao/registrar", {
        contratanteId,
        cuidadorId,
        agendamentoId,
        estrelas,
        comentario,
      });

      toast.success("Avaliação enviada com sucesso!");
      resetarCampos();
      onClose(true);
    } catch (err) {
      console.error(err);
      toast.error("Avaliação já registrada para este agendamento");
    } finally {
      setLoading(false);
    }
  };

  const resetarCampos = () => {
    setEstrelas(0);
    setComentario("");
  };

  const fecharModal = () => {
    resetarCampos();
    onClose(false);
  };

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>

      <div
        className={`modal fade show d-block ${modoEscuro ? "modo-escuro" : ""}`}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalAvaliacaoTitulo"
        style={{ zIndex: 1050, fontSize: `${tamanhoFonte}px` }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header bg-primary text-white justify-content-center">
              <h5 className="modal-title" id="modalAvaliacaoTitulo">
                Avaliar Cuidador
              </h5>
            </div>
            <div className="modal-body">
              <p className="fw-semibold mb-2">
                Como você avalia este atendimento?
              </p>
              <div
                className="mb-3"
                role="radiogroup"
                aria-label="Avaliação por estrelas"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <i
                    key={num}
                    className={`bi ${
                      num <= estrelas
                        ? "bi-star-fill text-warning"
                        : "bi-star text-muted"
                    }`}
                    style={{ fontSize: "1.8rem", cursor: "pointer" }}
                    onClick={() => setEstrelas(num)}
                    role="radio"
                    aria-checked={num === estrelas}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setEstrelas(num);
                      }
                    }}
                    aria-label={`${num} estrela${num > 1 ? "s" : ""}`}
                  />
                ))}
              </div>
              <div className="mb-3">
                <label htmlFor="comentarioAvaliacao" className="form-label">
                  <p className="fw-semibold mb-2">Comentário (opcional)</p>
                </label>
                <textarea
                  id="comentarioAvaliacao"
                  className="form-control"
                  rows="3"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Escreva um elogio ou sugestão..."
                  style={{ fontSize: `${tamanhoFonte}px` }}
                />
              </div>
            </div>
            <div className="modal-footer justify-content-center">
              <button className="btn btn-danger" onClick={fecharModal}>
                Fechar
              </button>
              <button
                className="btn btn-primary"
                disabled={estrelas === 0 || loading}
                onClick={enviarAvaliacao}
              >
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalAvaliacao;
