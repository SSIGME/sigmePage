import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import axios from "axios";
import "./EquipoDetail.css";
import React from "react";
import url from "../url.json";
import { Alert } from "@mui/material";
import useStore from "../src/utils/useStore";
import { useNavigate } from "react-router-dom";
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
  imagen: boolean;
  manual: boolean;
  protocolo: boolean;
  certificado: boolean;
  guia: boolean;
  planmantenimiento: boolean;
}
const EquipoDetail = () => {
  const navigate = useNavigate();
  const hospitalCode = useStore((state) => state.hospitalCode);
  const { codigoIdentificacion } = useParams();
  const [isEquipoGetted, setIsEquipoGetted] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Documents>({
    manual: false,
    protocolo: false,
    certificado: false,
    guia: false,
    planmantenimiento: false,
    imagen: false,
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
  const uploadImage = async (codigoIdentificacion: string) => {
    console.log("Botón presionado, abriendo seleccionador de archivos...");
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      console.log("Archivo seleccionado:", file.name);

      const formData = new FormData();
      formData.append("file", file, file.name);
      try {
        const response = await axios.post(
          `${url.url}/upload_image/${hospitalCode}/${codigoIdentificacion}`,
          formData
        );
        console.log("Respuesta:", response);
        if (response.status === 200) {
          console.log("Imagen subida correctamente:", response.data);
        }
      } catch (error) {
        console.error("Error subiendo imagen:", error);
      } finally {
        getEquipo(codigoIdentificacion);
        checkDocuments(codigoIdentificacion as string);
      }
    };
    input.click();
  };
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
          `${url.url}/upload_pdf/${hospitalCode}/${codigoIdentificacion}`,
          formData
        );
        console.log("Respuesta:", response);
        if (response.status === 200) {
          console.log("Documento subido correctamente:", response.data);
        }
      } catch (error) {
        console.error("Error subiendo documento:", error);
      } finally {
        checkDocuments(codigoIdentificacion as string);
      }
    };

    input.click();
  };

  const uploadDocument = async (codigoIdentificacion: string) => {
    try {
      const response = await axios.post(
        `${url.url}/upload_pdf/${hospitalCode}/${codigoIdentificacion}`
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
        `${url.url}/equipoDocuments/${hospitalCode}/${codigoIdentificacion}`
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
        `${url.url}/equipo/${hospitalCode}/${codigoIdentificacion}`
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
    <div className="container" style={{height: "100vh"}}>
      <h1 style={{ color: "black" }}>Detalles del equipo</h1>
      <div className="divEquipoo" style={{    
        flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    maxHeight: "80vh",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,}}>
        <div style={{     flexDirection: "column",
    backgroundColor: "#fff",
    padding: 20,
    width: "90%",
    height: "100%",
    display: "flex",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, }}>
        <div className="divImagen">
          {documents.imagen ? (
            <div
              style={{
                display: "flex",
              
                alignItems: "center",
                justifyContent: "center",
                width: "50%",
                marginRight: "0%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                borderRadius: "10px",
              }}
            >
              <img src={equipo.Imagen} className="Imagen" />

              <button
                onClick={() => {
                  uploadImage(codigoIdentificacion as string);
                }}
                className="buttonPickImage"
              >
                <img
                  className="imagenPickImage"
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/edit--v1.png"
                />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                uploadImage(codigoIdentificacion as string);
              }}
              className="button"
            >
              <img
                className="imageButton"
                src="https://img.icons8.com/ios-filled/50/FFFFFF/upload--v1.png"
              />
            </button>
          )}
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
        <button className="modern-button" onClick={() => navigate(`/hojavida/${equipo.codigoIdentificacion}`)}>Editar parámetros técnicos</button>
    
      </div>

    </div>
  );
};

export default EquipoDetail;
