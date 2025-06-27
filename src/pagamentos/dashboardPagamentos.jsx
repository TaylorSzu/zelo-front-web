import React from "react";
import ZelloPagamentosStatus from "../pagamentos/zelloPagamentosStatus.jsx";

const DashboardPagamentos = () => {
  const pendentes = [
    {
      nome: "Maria Costa",
      cargo: "Cuidadora Sênior",
      periodo: "15/06/2025 - 21/06/2025",
      horas: "35 horas",
      vencimento: "25/06/2025",
      valor: 1750.0,
    },
  ];

  const cancelados = [
    {
      nome: "Roberto Santos",
      cargo: "Fisioterapeuta",
      motivo: "Paciente internado",
      dataCancelamento: "10/06/2025",
      valor: 280.0,
    },
  ];

  const pagos = [
    {
      nome: "Maria Costa",
      cargo: "Cuidadora Sênior",
      dataPagamento: "15/06/2025",
      metodo: "Transferência Bancária",
      valor: 1750.0,
    },
  ];

  return (
    <div className="container py-4">
      <ZelloPagamentosStatus
        pendentes={pendentes}
        cancelados={cancelados}
        pagos={pagos}
      />
    </div>
  );
};

export default DashboardPagamentos;
