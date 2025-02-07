import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const ComponentDialog = ({ open, onClose, onSave }) => {
  const [componentes, setComponentes] = useState([
    { id: 1, nombre: "", cantidad: 0 },

  ]);

  const agregarComponente = () => {
    const nuevoId = componentes.length + 1;
    setComponentes([...componentes, { id: nuevoId, nombre: "", cantidad: 0 }]);
  };

  const eliminarComponente = (id) => {
    setComponentes(componentes.filter((comp) => comp.id !== id));
  };

  const actualizarComponente = (id, campo, valor) => {
    setComponentes(
      componentes.map((comp) =>
        comp.id === id ? { ...comp, [campo]: valor } : comp
      )
    );
  };

  const handleSave = () => {
    const data = componentes.map(({ nombre, cantidad }) => ({ nombre, cantidad }));
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle style={{ textAlign: "center", fontWeight: "100", fontFamily:'fantasy' }}>
        Componentes y accesorios del equipo
      </DialogTitle>
      <DialogContent               style={{paddingTop: "10px" }}>
   
        {componentes.map((comp) => (
          <div
            key={comp.id}
            style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}
          >
            <TextField
              label="Nombre"
              value={comp.nombre}
              onChange={(e) => actualizarComponente(comp.id, "nombre", e.target.value)}
              fullWidth
              style={{marginBottom: "10px" }}
              variant="outlined"
            />
            <TextField
              label="Cantidad"
              type="number"
              value={comp.cantidad}
              style={{marginBottom: "10px" }}
              onChange={(e) => actualizarComponente(comp.id, "cantidad", Number(e.target.value))}
              fullWidth
              variant="outlined"
            />
            <IconButton onClick={() => eliminarComponente(comp.id)}>
              <FontAwesomeIcon icon={faMinus} style={{ color: "black" }} />
            </IconButton>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          <IconButton 
            onClick={agregarComponente} 
            style={{ backgroundColor: "#000217", color: "white", borderRadius: "50px", padding: "10px" }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </IconButton>
        </div>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary" 
          fullWidth
          style={{
            width: "100%",
            height: "60px",
            fontSize: "16px",
            fontFamily: "fantasy",
            fontWeight: "200",
            backgroundColor: "#000000",
            border: "none",
            borderRadius: "15px",
            marginRight: "auto",
            marginTop: "20px",
            color: "#ffffff",
            alignSelf: "center",
          }}
        >
          Guardar
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ComponentDialog;
