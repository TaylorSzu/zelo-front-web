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
    <div className="container px-3 py-5">
      <div className="card shadow rounded-4 border-0">
        <div className="card-header bg-primary text-white rounded-top-4 text-center">
          <h3 className="m-0">Avaliações do Cuidador</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <>
              <div className="mb-4 text-center">
                <h4 className="fw-bold text-dark">
                  Média geral:{" "}
                  {media ? (
                    <span className="text-warning fs-3">
                      {parseFloat(media).toFixed(1)} <FaStar />
                    </span>
                  ) : (
                    <span className="text-muted fs-5">Sem avaliações</span>
                  )}
                </h4>
              </div>

              {avaliacoes.length === 0 ? (
                <p className="text-muted text-center">
                  Nenhuma avaliação disponível.
                </p>
              ) : (
                <div className="row justify-content-center g-3">
                  {avaliacoes.map((av) => (
                    <div key={av.id} className="col-md-6 col-lg-4">
                      <div className="card rounded-4 shadow-sm h-100">
                        <div className="card-body">
                          <div className="mb-2">
                            {Array.from({ length: av.estrelas }).map((_, i) => (
                              <FaStar
                                key={i}
                                className="text-warning me-1 fs-5"
                              />
                            ))}
                          </div>
                          {av.comentario && (
                            <p className="mb-2">{av.comentario}</p>
                          )}
                          <small className="text-muted">
                            Avaliado em{" "}
                            {new Date(av.createdAt).toLocaleDateString("pt-BR")}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
