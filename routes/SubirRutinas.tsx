import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import "./SubirRutinas.css";
import url from "../url.json";
import useStore from "../src/utils/useStore";

interface Pregunta {
  id: number;
  pregunta: string;
  tipo: string;
  opciones?: string[];
}
const SubirRutinas = () => {
  const hospitalCode = useStore((state) => state.hospitalCode);
  const [option, setOption] = useState("");
  const [tipos, setTipos] = useState([]);
  const [filteredTipos, setFilteredTipos] = useState([]);
  const [search, setSearch] = useState("");
  const [inputs, setInputs] = useState<string[]>([]);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  
  const [selectedTipo, setSelectedTipo] = useState("");
  const addOption = (index: number) => {
    console.log("Añadiendo opción");
    const newPreguntas = [...preguntas];
    newPreguntas[index].opciones.push("");
    setPreguntas(newPreguntas);
  };
  const deleteOption = (index: number, optionIndex: number) => {
    const newPreguntas = [...preguntas];
    newPreguntas[index].opciones.splice(optionIndex, 1);
    setPreguntas(newPreguntas);
  };
  useEffect(() => {
    console.log(preguntas);
  }, [preguntas]);

  const handleInputChange = (text: string, index: number) => {
    const newInputs = [...inputs];
    newInputs[index] = text;
    setInputs(newInputs);
    setPreguntas(
      newInputs.map((pregunta, idx) => ({
        ...preguntas[idx],
        pregunta,
      }))
    );
  };
  const addInput = () => {
    setInputs([...inputs, ""]);
    setPreguntas([
      ...preguntas,
      {
        pregunta: "",
        tipo: "cerrada",
        opciones: [
          "Efectuado",
          "No Efectuado",
          "No aplica",
          "Presenta Anomalia",
        ],
        id: preguntas.length,
      },
    ]);
  };
  const updateTipoPregunta = (index: number, tipo: string) => {
    const newPreguntas = [...preguntas];
    newPreguntas[index] = {
      ...newPreguntas[index],
      tipo,
      opciones:
        tipo === "cerrada"
          ? ["Efectuado", "No Efectuado", "No aplica", "Presenta Anomalia"]
          : [],
    };
    setPreguntas(newPreguntas);
  };
  const removeInput = (index: number) => {
    const newInputs = [...inputs];
    const newPreguntas = [...preguntas];
    newInputs.splice(index, 1);
    newPreguntas.splice(index, 1);
    setInputs(newInputs);
    setPreguntas(newPreguntas);
  };

  const uploadRutina = async () => {
    if (preguntas.length === 0) {
      return;
    } else {
      const additionalQuestions = [
        {
          id: 999,
          pregunta: "Hallazgos del mantenimiento",
          tipo: "abierta",
          opciones: [],
        },
        {
          id: 1000,
          pregunta: "Observaciones del mantenimiento",
          tipo: "abierta",
          opciones: [],
        },
      ];
      const finalPreguntas = [...preguntas, ...additionalQuestions];
      try {
        const response = await axios.post(`${url.url}/rutina/${hospitalCode}`, {
          tipoequipo: selectedTipo,
          preguntas: finalPreguntas,
        });
        console.log(response.status);
        if (response.status === 201) {
          console.log("Rutina subida correctamente");
        }
        if (response.status === 206) {
          console.log("La rutina ya existe");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    getTipos();
  }, []);

  const searchFilterFunction = (text: string) => {
    if (text) {
      const newData = tipos;
      const filteredData = newData.filter((item) => {
        const itemData = item.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredTipos(filteredData);
    }
  };
  const getTipos = async () => {
    try {
      const response = await axios.get(`${url.url}/tipos/${hospitalCode}`);
      console.log("Tipos:", response.data); // Verifica la respuesta
      setTipos(response.data);
      setFilteredTipos(response.data);
    } catch (error) {
      console.error("Error obteniendo tipos:", error);
    }
  };
  return (
    <div className="container-rutinas">
      <h2>Selecciona el tipo de rutina</h2>
      <div className="flexdiv">
        <input
          type="text"
          className="searchInput-rutinas"
          placeholder={
            selectedTipo === ""
              ? "Buscar tipo"
              : "Tipo seleccionado: " + selectedTipo
          }
          value={search}
          onChange={(e) => {
            setSelectedTipo(e.target.value);
            setSearch(e.target.value);
            searchFilterFunction(e.target.value);
          }}
        />
        <select
          className="customSelect"
          onChange={(e) => setOption(e.target.value)}
        >
          <option value="">Tipo rutina</option>
          <option value="preventivo">Preventivo</option>
          <option value="correctivo">Correctivo </option>
        </select>
      </div>
      <div className="divOptions-rutinas">
        {filteredTipos.map((tipo, index) => (
            <button
              key={index}
              className="option"
              onClick={() => {
                setSelectedTipo(tipo);
                setSearch("");
                setFilteredTipos([]);
              }}
            >
              {tipo}
            </button>
        ))}
      </div>
      {option === "" || selectedTipo === "" ? null : (
        <div className="divPreguntas">
          <p className="textcenter">Ingresa las preguntas para la rutina: </p>
          <p className="textcenter" style={{ marginBottom: "5%" }}>
            {" "}
            Preguntas actuales {inputs.length}
          </p>
          {inputs.map((input, index) => (
            <div key={index} className="divInput">
              <p className="textcenter">Pregunta {index + 1}</p>
              <input
                className="inputquestion"
                type="text"
                value={input}
                onChange={(e) => handleInputChange(e.target.value, index)}
              />
              <select
                className="selectQuestion"
                value={preguntas[index].tipo}
                onChange={(e) => updateTipoPregunta(index, e.target.value)}
              >
                <option value="abierta">Abierta</option>
                <option value="cerrada">Cerrada</option>
              </select>
              {preguntas[index].tipo === "cerrada" ? (
                <div>
                  {preguntas[index].opciones.map((opcion, optionIndex) => (
                    <div className="divOption" key={optionIndex}>
                      <p className="textcenter"> Opción: # {optionIndex + 1}</p>
                      <input
                        type="text"
                        className="inputoption"
                        value={opcion}
                        onChange={(e) => {
                          const newPreguntas = [...preguntas];
                          newPreguntas[index].opciones[optionIndex] =
                            e.target.value;
                          setPreguntas(newPreguntas);
                        }}
                      />
                      <button
                        className="deleteOption"
                        onClick={() => deleteOption(index, optionIndex)}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                  <div className="divCenter">
                    <button
                      className="addoption"
                      onClick={() => addOption(index)}
                    >
                      Añadir opción
                    </button>
                  </div>
                </div>
              ) : null}
              <div className="divCenter">
                <button
                  className="deleteQuestion"
                  onClick={() => removeInput(index)}
                >
                  Eliminar Pregunta
                </button>
              </div>
            </div>
          ))}
          <div
            className="divCenter"
            style={{ borderTop: "1px solid #ccc", paddingTop: "10px" }}
          >
            <button className="addQuestion" onClick={addInput}>
              Añadir nueva pregunta
            </button>
          </div>
        </div>
      )}
      {preguntas.length > 0 ? (
        <div className="divCenter">
          <button className="uploadRutina" onClick={uploadRutina}>
            Subir rutina
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default SubirRutinas;
