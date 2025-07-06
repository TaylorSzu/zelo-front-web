import React from "react";
import { IMaskInput } from "react-imask";

const Mascara = ({ type, value, onChange, placeholder, className }) => {
  let mask = "";
  let extraProps = {};

  switch (type) {
    case "cpf":
      mask = "000.000.000-00";
      break;
    case "cep":
      mask = "00000-000";
      break;
    case "telefone":
      mask = "(00) 00000-0000";
      break;
    case "data":
      mask = "00/00/0000";
      extraProps.blocks = {
        dia: {
          mask: IMaskInput.MaskedRange,
          from: 1,
          to: 31,
          maxLength: 2
        },
        mes: {
          mask: IMaskInput.MaskedRange,
          from: 1,
          to: 12,
          maxLength: 2
        },
        ano: {
          mask: IMaskInput.MaskedRange,
          from: 1900,
          to: new Date().getFullYear(),
          maxLength: 4
        }
      };
      break;
    case "hora":
      mask = "00:00";
      break;
    case "dinheiro":
      mask = "R$ num";
      extraProps.blocks = {
        num: {
          mask: Number,
          scale: 2,
          thousandsSeparator: ".",
          padFractionalZeros: true,
          radix: ",",
          signed: false,
        },
      };
      break;
    default:
      mask = "";
  }

  return (
    <IMaskInput
      mask={mask}
      {...extraProps} 
      value={value}
      onAccept={(val) => onChange({ target: { value: val } })}
      placeholder={placeholder}
      className={`input-style ${className}`} 
      type="text"
    />
  );
};

export function formatarTelefone(telefone) {
  const apenasNumeros = telefone.replace(/\D/g, '');
  if (apenasNumeros.length === 11) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7)}`;
  }
  if (apenasNumeros.length === 10) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 6)}-${apenasNumeros.slice(6)}`;
  }
  return telefone;
}

export function removerMascara(valor) {
  return valor.replace(/[^\d]+/g, "");
}

export function removerMascaraDinheiro(valor, tipo = "texto") {
  if (!valor) return "";

  if (tipo === "dinheiro") {
    return valor
      .replace(/\s/g, '')
      .replace('R$', '')
      .replace(/\./g, '')
      .replace(/,/g, '.')
      .trim();
  }

  return valor.replace(/[^\d]+/g, "");
}


export function removerMascaraData(valor) {
  if (!valor) return "";
  return valor.replace(/[^\d]+/g, "");
}

export function converterFormatoData(data) {
  if (!data) return "";
  
  // Converte data do formato yyyy-mm-dd para dd/mm/yyyy
  const [ano, mes, dia] = data.split(/[-\/]/);
  return `${dia}/${mes}/${ano}`;
}

export default Mascara;