// src/context/AcessibilidadeContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AcessibilidadeContext = createContext();

export const AcessibilidadeProvider = ({ children }) => {
  const [modoEscuro, setModoEscuro] = useState(() => {
    return localStorage.getItem("modoEscuro") === "true";
  });

  const [tamanhoFonte, setTamanhoFonte] = useState(() => {
    return parseInt(localStorage.getItem("tamanhoFonte")) || 16;
  });

  // Sempre que mudar o estado, atualiza o localStorage e aplica no body
  useEffect(() => {
    localStorage.setItem("modoEscuro", modoEscuro);
    localStorage.setItem("tamanhoFonte", tamanhoFonte);

    document.body.classList.toggle("modo-escuro", modoEscuro);
    document.body.style.fontSize = `${tamanhoFonte}px`;
  }, [modoEscuro, tamanhoFonte]);

  return (
    <AcessibilidadeContext.Provider
      value={{
        modoEscuro,
        setModoEscuro,
        tamanhoFonte,
        setTamanhoFonte,
      }}
    >
      {children}
    </AcessibilidadeContext.Provider>
  );
};
