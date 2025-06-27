import React, { useState, useEffect } from "react";

const diasSemana = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

function formatarDisponibilidade(diasAtivos) {
  if (diasAtivos.length === 7) return "Todos os dias";

  const indices = diasAtivos
    .map((dia) => diasSemana.indexOf(dia))
    .sort((a, b) => a - b);

  let grupos = [];
  let grupoAtual = [indices[0]];

  for (let i = 1; i < indices.length; i++) {
    if (indices[i] === indices[i - 1] + 1) {
      grupoAtual.push(indices[i]);
    } else {
      grupos.push(grupoAtual);
      grupoAtual = [indices[i]];
    }
  }
  grupos.push(grupoAtual);

  const partes = grupos.map((grupo) =>
    grupo.length === 1
      ? diasSemana[grupo[0]]
      : `${diasSemana[grupo[0]]} a ${diasSemana[grupo[grupo.length - 1]]}`
  );

  return partes.length === 1
    ? partes[0]
    : partes.slice(0, -1).join(", ") + " e " + partes[partes.length - 1];
}

const ModalDisponibilidade = ({ onConfirmar, onCancelar }) => {
  const [disponibilidadePorDia, setDisponibilidadePorDia] = useState(
    diasSemana.map((dia) => ({
      dia,
      inicio: "",
      fim: "",
      ativo: false,
    }))
  );

  const [disponibilidadeTexto, setDisponibilidadeTexto] = useState("");

  const handleHorarioChange = (index, campo, valor) => {
    const nova = [...disponibilidadePorDia];
    nova[index][campo] = valor;
    nova[index].ativo = nova[index].inicio && nova[index].fim;
    setDisponibilidadePorDia(nova);
  };

  useEffect(() => {
    const diasAtivos = disponibilidadePorDia.filter((d) => d.ativo);
    if (diasAtivos.length === 0) {
      setDisponibilidadeTexto("");
      return;
    }

    const [primeiroInicio, primeiroFim] = [
      diasAtivos[0].inicio,
      diasAtivos[0].fim,
    ];
    const mesmoHorario = diasAtivos.every(
      (d) => d.inicio === primeiroInicio && d.fim === primeiroFim
    );

    setDisponibilidadeTexto(
      mesmoHorario
        ? `${formatarDisponibilidade(
            diasAtivos.map((d) => d.dia)
          )}: ${primeiroInicio} - ${primeiroFim}`
        : diasAtivos.map((d) => `${d.dia}: ${d.inicio} - ${d.fim}`).join(" | ")
    );
  }, [disponibilidadePorDia]);

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>

      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content p-4 shadow rounded-4">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Atualizar Disponibilidade</h5>
            </div>

            <div className="modal-body">
              <div className="row">
                {disponibilidadePorDia.map((diaObj, index) => (
                  <div className="col-sm-6 mb-3" key={diaObj.dia}>
                    <label className="form-label">{diaObj.dia}</label>
                    <div className="d-flex gap-2">
                      <input
                        type="time"
                        className="form-control"
                        value={diaObj.inicio}
                        onChange={(e) =>
                          handleHorarioChange(index, "inicio", e.target.value)
                        }
                      />
                      <input
                        type="time"
                        className="form-control"
                        value={diaObj.fim}
                        onChange={(e) =>
                          handleHorarioChange(index, "fim", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Disponibilidade Selecionada
                </label>
                <input
                  type="text"
                  className="form-control fw-bold"
                  value={disponibilidadeTexto}
                  disabled
                />
              </div>
            </div>

            <div className="modal-footer justify-content-center">
              <button className="btn btn-danger" onClick={onCancelar}>
                Voltar
              </button>
              <button
                className="btn btn-primary"
                disabled={!disponibilidadeTexto}
                onClick={() =>
                  onConfirmar({ disponibilidade: disponibilidadeTexto })
                }
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalDisponibilidade;
