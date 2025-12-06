import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import "./SubirRutinas.css";
import url from "../url.json";
import useStore from "../src/utils/useStore";
const SubirRutinas = () => {
    const hospitalCode = useStore((state) => state.hospitalCode);
    const [option, setOption] = useState("");
    const [tipos, setTipos] = useState([]);
    const [filteredTipos, setFilteredTipos] = useState([]);
    const [search, setSearch] = useState("");
    const [inputs, setInputs] = useState([]);
    const [preguntas, setPreguntas] = useState([]);
    const [selectedTipo, setSelectedTipo] = useState("");
    const addOption = (index) => {
        console.log("Añadiendo opción");
        const newPreguntas = [...preguntas];
        newPreguntas[index].opciones.push("");
        setPreguntas(newPreguntas);
    };
    const deleteOption = (index, optionIndex) => {
        const newPreguntas = [...preguntas];
        newPreguntas[index].opciones.splice(optionIndex, 1);
        setPreguntas(newPreguntas);
    };
    useEffect(() => {
        console.log(preguntas);
    }, [preguntas]);
    const handleInputChange = (text, index) => {
        const newInputs = [...inputs];
        newInputs[index] = text;
        setInputs(newInputs);
        setPreguntas(newInputs.map((pregunta, idx) => ({
            ...preguntas[idx],
            pregunta,
        })));
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
    const updateTipoPregunta = (index, tipo) => {
        const newPreguntas = [...preguntas];
        newPreguntas[index] = {
            ...newPreguntas[index],
            tipo,
            opciones: tipo === "cerrada"
                ? ["Efectuado", "No Efectuado", "No aplica", "Presenta Anomalia"]
                : [],
        };
        setPreguntas(newPreguntas);
    };
    const removeInput = (index) => {
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
        }
        else {
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
            }
            catch (error) {
                console.error(error);
            }
        }
    };
    useEffect(() => {
        getTipos();
    }, []);
    const searchFilterFunction = (text) => {
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
        }
        catch (error) {
            console.error("Error obteniendo tipos:", error);
        }
    };
    return (React.createElement("div", { className: "container-rutinas" },
        React.createElement("h2", null, "Selecciona el tipo de rutina"),
        React.createElement("div", { className: "flexdiv" },
            React.createElement("input", { type: "text", className: "searchInput-rutinas", placeholder: selectedTipo === ""
                    ? "Buscar tipo"
                    : "Tipo seleccionado: " + selectedTipo, value: search, onChange: (e) => {
                    setSelectedTipo(e.target.value);
                    setSearch(e.target.value);
                    searchFilterFunction(e.target.value);
                } }),
            React.createElement("select", { className: "customSelect", onChange: (e) => setOption(e.target.value) },
                React.createElement("option", { value: "" }, "Tipo rutina"),
                React.createElement("option", { value: "preventivo" }, "Preventivo"),
                React.createElement("option", { value: "correctivo" }, "Correctivo "))),
        React.createElement("div", { className: "divOptions-rutinas" }, filteredTipos.map((tipo, index) => (React.createElement("button", { key: index, className: "option", onClick: () => {
                setSelectedTipo(tipo);
                setSearch("");
                setFilteredTipos([]);
            } }, tipo)))),
        option === "" || selectedTipo === "" ? null : (React.createElement("div", { className: "divPreguntas" },
            React.createElement("p", { className: "textcenter" }, "Ingresa las preguntas para la rutina: "),
            React.createElement("p", { className: "textcenter", style: { marginBottom: "5%" } },
                " ",
                "Preguntas actuales ",
                inputs.length),
            inputs.map((input, index) => (React.createElement("div", { key: index, className: "divInput" },
                React.createElement("p", { className: "textcenter" },
                    "Pregunta ",
                    index + 1),
                React.createElement("input", { className: "inputquestion", type: "text", value: input, onChange: (e) => handleInputChange(e.target.value, index) }),
                React.createElement("select", { className: "selectQuestion", value: preguntas[index].tipo, onChange: (e) => updateTipoPregunta(index, e.target.value) },
                    React.createElement("option", { value: "abierta" }, "Abierta"),
                    React.createElement("option", { value: "cerrada" }, "Cerrada")),
                preguntas[index].tipo === "cerrada" ? (React.createElement("div", null,
                    preguntas[index].opciones.map((opcion, optionIndex) => (React.createElement("div", { className: "divOption", key: optionIndex },
                        React.createElement("p", { className: "textcenter" },
                            " Opci\u00F3n: # ",
                            optionIndex + 1),
                        React.createElement("input", { type: "text", className: "inputoption", value: opcion, onChange: (e) => {
                                const newPreguntas = [...preguntas];
                                newPreguntas[index].opciones[optionIndex] =
                                    e.target.value;
                                setPreguntas(newPreguntas);
                            } }),
                        React.createElement("button", { className: "deleteOption", onClick: () => deleteOption(index, optionIndex) }, "Eliminar")))),
                    React.createElement("div", { className: "divCenter" },
                        React.createElement("button", { className: "addoption", onClick: () => addOption(index) }, "A\u00F1adir opci\u00F3n")))) : null,
                React.createElement("div", { className: "divCenter" },
                    React.createElement("button", { className: "deleteQuestion", onClick: () => removeInput(index) }, "Eliminar Pregunta"))))),
            React.createElement("div", { className: "divCenter", style: { borderTop: "1px solid #ccc", paddingTop: "10px" } },
                React.createElement("button", { className: "addQuestion", onClick: addInput }, "A\u00F1adir nueva pregunta")))),
        preguntas.length > 0 ? (React.createElement("div", { className: "divCenter" },
            React.createElement("button", { className: "uploadRutina", onClick: uploadRutina }, "Subir rutina"))) : null));
};
export default SubirRutinas;
