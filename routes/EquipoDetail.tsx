import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import axios from "axios";
import "./EquipoDetail.css";
import React from "react";
interface Equipo {
  area: string;
  Imagen: string;
  codigoIdentificacion: string;
  Tipo: string;
  Marca: string;
  Modelo: string;
  Serie: string;
}
interface Documents {
  manual: boolean;
  protocolo: boolean;
  certificado: boolean;
  guia: boolean;
  planmantenimiento: boolean;
}
const EquipoDetail = () => {
  const { codigoIdentificacion } = useParams();
  const [isEquipoGetted, setIsEquipoGetted] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Documents>({
    manual: false,
    protocolo: false,
    certificado: false,
    guia: false,
    planmantenimiento: false,
  });
  const [equipo, setEquipo] = useState<Equipo>({
    area: "",
    Imagen: "",
    codigoIdentificacion: "",
    Tipo: "",
    Marca: "",
    Modelo: "",
    Serie: "",
  });
  const pickDocument = (filename: string) => {
    console.log("Botón presionado, abriendo seleccionador de archivos...");

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf";

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      console.log("Archivo seleccionado:", file.name);

      const formData = new FormData();
      formData.append("file", file, filename);
      try {
        const response = await axios.post(
          `https://interference-subcommittee-destroyed-portable.trycloudflare.com/upload_pdf/PALM/${codigoIdentificacion}`,
          formData
        );
        console.log("Respuesta:", response);
        if (response.status === 200) {
          console.log("Documento subido correctamente:", response.data);
        }
      } catch (error) {
        console.error("Error subiendo documento:", error);
      }
    };

    input.click();
  };

  const uploadDocument = async (codigoIdentificacion: string) => {
    try {
      const response = await axios.post(
        `https://interference-subcommittee-destroyed-portable.trycloudflare.com/health/upload_pdf/PALM/${codigoIdentificacion}`
      );
      if (response.status === 200) {
        setDocuments(response.data);
        console.log("Documentos:", response.data); // Verifica la respuesta
      }
    } catch (error) {
      console.error("Error obteniendo equipo:", error);
    }
  };
  const checkDocuments = async (codigoIdentificacion: string) => {
    try {
      const response = await axios.get(
        `https://interference-subcommittee-destroyed-portable.trycloudflare.com/equipoDocuments/PALM/${codigoIdentificacion}`
      );
      if (response.status === 200) {
        setDocuments(response.data);
        console.log("Documentos:", response.data); // Verifica la respuesta
      }
    } catch (error) {
      console.error("Error obteniendo equipo:", error);
    }
  };
  const getEquipo = async (codigoIdentificacion: string) => {
    try {
      const response = await axios.get(
        `https://interference-subcommittee-destroyed-portable.trycloudflare.com/equipo/PALM/${codigoIdentificacion}`
      );
      if (response.status === 200) {
        setIsEquipoGetted(true);
        setEquipo(response.data);
        console.log("Equipo:", response.data.Imagen); // Verifica la respuesta
      }
    } catch (error) {
      console.error("Error obteniendo equipo:", error);
    }
  };
  useEffect(() => {
    getEquipo(codigoIdentificacion);
    checkDocuments(codigoIdentificacion as string);
  }, [codigoIdentificacion]);

  return (
    <div className="container">
      <h1>Detalle del equipo</h1>
      <div className="divEquipoo">
        <div className="divImagen">
          <img src={equipo.Imagen} className="Imagen" />
        </div>
        <div className="divInfoo">
          <div className="divInfoLeft">
            <p>CODIGO </p>
            <p>TIPO</p>
            <p>MARCA</p>
            <p>MODELO</p>
            <p>SERIE</p>
            <p>AREA</p>
          </div>
          <div className="divInfoRight">
            <p>{equipo.codigoIdentificacion}</p>
            <p>{equipo.Tipo}</p>
            <p>{equipo.Marca}</p>
            <p>{equipo.Modelo}</p>
            <p>{equipo.Serie}</p>
            <p>{equipo.area}</p>
          </div>
        </div>
        <div className="divButtons">
          <div className="divButton">
            <button
              onClick={() => {
                pickDocument("Manual_de_uso.pdf");
              }}
              className="button"
            >
              {documents.manual ? (
                <img
                  className="imageButton"
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/edit--v1.png"
                />
              ) : (
                <img
                  className="imageButton"
                  src="https://img.icons8.com/ios/50/FFFFFF/upload--v1.png"
                />
              )}
            </button>
            <p>Manual de uso</p>
          </div>
          <div className="divButton">
            <button
              className="button"
              onClick={() => {
                pickDocument("Protocolo_de_limpieza_y_desinfeccion.pdf");
              }}
            >
              {documents.protocolo ? (
                <img
                  className="imageButton"
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/edit--v1.png"
                />
              ) : (
                <img
                  className="imageButton"
                  src="https://img.icons8.com/ios/50/FFFFFF/upload--v1.png"
                />
              )}
            </button>
            <p>Protocolo de limpieza</p>
          </div>
          <div className="divButton">
            <button
              className="button"
              onClick={() => {
                pickDocument("Certificado_de_calibracion.pdf");
              }}
            >
              {documents.certificado ? (
                <img
                  className="imageButton"
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/edit--v1.png"
                />
              ) : (
                <img
                  className="imageButton"
                  src="https://img.icons8.com/ios/50/FFFFFF/upload--v1.png"
                />
              )}
            </button>
            <p>Certificado de calibracion</p>
          </div>
          <div className="divButton">
            <button
              className="button"
              onClick={() => {
                pickDocument("Guia_Rapida.pdf");
              }}
            >
              {documents.guia ? (
                <img
                  className="imageButton"
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/edit--v1.png"
                />
              ) : (
                <img
                  className="imageButton"
                  src="https://img.icons8.com/ios/50/FFFFFF/upload--v1.png"
                />
              )}
            </button>
            <p>Guia Rapida</p>
          </div>
          <div className="divButton">
            <button
              className="button"
              onClick={() => {
                pickDocument("Plan_de_mantenimiento.pdf");
              }}
            >
              {documents.planmantenimiento ? (
                <img
                  className="imageButton"
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/edit--v1.png"
                />
              ) : (
                <img
                  className="imageButton"
                  src="https://img.icons8.com/ios/50/FFFFFF/upload--v1.png"
                />
              )}
            </button>
            <p>Plan de mantenimiento</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipoDetail;
