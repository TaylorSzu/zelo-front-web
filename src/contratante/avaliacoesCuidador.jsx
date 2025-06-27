import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function AvaliacoesCuidador() {
  const { cuidadorId } = useParams();
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAvaliacoes();
  }, []);

  const carregarAvaliacoes = async () => {
    try {
      setLoading(true);
      const [avaliacoesResp, mediaResp] = await Promise.all([
        axios.get(`http://localhost:5171/avaliacao/cuidador/${cuidadorId}`, {
          withCredentials: true,
        }),
        axios.get(`http://localhost:5171/avaliacao/media/${cuidadorId}`, {
          withCredentials: true,
        }),
      ]);

      setAvaliacoes(avaliacoesResp.data || []);
      setMedia(mediaResp.data?.media || null);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-primary">Avaliações</h2>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div className="mb-4">
            <h4 className="fw-semibold">
              Média geral:{" "}
              {media ? (
                <>
                  {parseFloat(media).toFixed(1)}{" "}
                  <FaStar className="text-warning mb-1" />
                </>
              ) : (
                <span className="text-muted">Sem avaliações</span>
              )}
            </h4>
          </div>

          {avaliacoes.length === 0 ? (
            <p className="text-muted">Nenhuma avaliação disponível.</p>
          ) : (
            <div className="list-group">
              {avaliacoes.map((av) => (
                <div
                  key={av.id}
                  className="list-group-item mb-3 rounded-3 shadow-sm p-3"
                >
                  <div className="mb-2">
                    {Array.from({ length: av.estrelas }).map((_, i) => (
                      <FaStar key={i} className="text-warning me-1 fs-5" />
                    ))}
                  </div>
                  {av.comentario && (
                    <p className="mb-1">{av.comentario}</p>
                  )}
                  <small className="text-muted">
                    Avaliado em {new Date(av.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
