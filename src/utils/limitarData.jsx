import React from "react";

export default function DataRestrita({ value, onChange, className = "", ...props }) {
  const hoje = new Date();
  const dataMin = hoje.toISOString().split("T")[0];

  const dataMaxObj = new Date(hoje);
  dataMaxObj.setMonth(dataMaxObj.getMonth() + 3);
  const dataMax = dataMaxObj.toISOString().split("T")[0];

  const handleChange = (e) => {
    const novaData = e.target.value;
    const dataSelecionada = new Date(novaData);

    if (dataSelecionada < new Date(dataMin) || dataSelecionada > new Date(dataMax)) {
      alert(`Selecione uma data entre ${dataMin} e ${dataMax}`);
      return;
    }

    onChange(novaData);
  };

  return (
    <input
      type="date"
      className={`form-control ${className}`}
      min={dataMin}
      max={dataMax}
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
}
