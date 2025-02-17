import { useEffect, useState } from "react";
import "./SubirRutinas.css";
import axios from "axios";
interface Pregunta {
  id: number;
  pregunta: string;
  tipo: string;
  opciones?: string[];
}
const SubirRutinas = () => {
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
            { id: 999, pregunta: "Hallazgos del mantenimiento", tipo: "abierta", opciones: [] },
            { id: 1000, pregunta: "Observaciones del mantenimiento", tipo: "abierta", opciones: [] },
        ];
        const finalPreguntas = [...preguntas, ...additionalQuestions];
      try {
        const response = await axios.post(`http://localhost:5000/rutina/PALM`, {
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
      const response = await axios.get("http://localhost:5000/tipos/PALM");
      console.log("Tipos:", response.data); // Verifica la respuesta
      setTipos(response.data);
      setFilteredTipos(response.data);
    } catch (error) {
      console.error("Error obteniendo tipos:", error);
    }
  };
  return (
    <div className="container">
      <h1>Subir Rutinas</h1>
      <h2>Selecciona el tipo de rutina</h2>
      <select onChange={(e) => setOption(e.target.value)}>
        <option value="">Selecciona aquí</option>
        <option value="singleEquipment">Preventivo</option>
        <option value="areaEquipment">Correctivo </option>
      </select>
      <input
        type="text"
        className="searchInput"
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
      <div className="divOptions">
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
          <p>Ingresa las preguntas para la rutina: </p>
          <p> Preguntas actuales {inputs.length}</p>
          <button onClick={addInput}>Añadir pregunta</button>
          {inputs.map((input, index) => (
            <div key={index} className="divInput">
              <input
                type="text"
                value={input}
                onChange={(e) => handleInputChange(e.target.value, index)}
              />
                <select
                value={preguntas[index].tipo}
                onChange={(e) => updateTipoPregunta(index, e.target.value)}
                >
                <option value="abierta">Abierta</option>
                <option value="cerrada">Cerrada</option>
                </select>
              {preguntas[index].tipo === "cerrada" ? (
                <div>
                  {preguntas[index].opciones.map((opcion, optionIndex) => (
                    <div key={optionIndex}>
                      <input
                        type="text"
                        value={opcion}
                        onChange={(e) => {
                          const newPreguntas = [...preguntas];
                          newPreguntas[index].opciones[optionIndex] =
                            e.target.value;
                          setPreguntas(newPreguntas);
                        }}
                      />
                      <button onClick={() => deleteOption(index, optionIndex)}>
                        Eliminar
                      </button>
                    </div>
                  ))}
                  <button onClick={() => addOption(index)}>
                    Añadir opción
                  </button>
                </div>
              ) : null}
              <button onClick={() => removeInput(index)}>Eliminar</button>
            </div>
          ))}
        </div>
      )}
      {preguntas.length > 0 ? (
        <button onClick={uploadRutina}>Subir rutina</button>
      ) : null}
    </div>
  );
};

export default SubirRutinas;
