import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from "react-router-dom";
import url from "../../url.json";
import axios from "axios";

import useStore from "../../src/utils/useStore";
const styles = {
  
        container: {
          padding: '24px',
          backgroundColor: '#e5e7eb',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        title: {
          fontSize: '28px',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '24px',
          textAlign: 'center',
          letterSpacing: '0.5px',
        },
        card: {
          padding: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.05)',
          marginBottom: '16px',
          width: '100%',
          maxWidth: '600px',
          transition: 'transform 0.3s, box-shadow 0.3s',
        },
        cardHover: {
          transform: 'scale(1.02)',
          boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.1)',
        },
        label: {
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '8px',
          fontWeight: '500',
        },
        input: {
          width: '100%',
          padding: '12px',
          border: '1px solid #d1d5db',
          borderRadius: '12px',
          marginBottom: '16px',
          backgroundColor: '#f9fafb',
          transition: 'border-color 0.3s, background-color 0.3s',
        },
        inputFocus: {
          borderColor: '#070e27',
          backgroundColor: '#ffffff',
        },
     
        buttonHover: {
          backgroundColor: '#070e25',
          boxShadow: '0px 6px 12px rgba(10, 126, 164, 0.3)',
        },
        modernButton: {
          padding: '17px 24px',
          backgroundColor: '#070e27',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 600,
          border: 'none',
          width: '25%',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
    
          bottom: '15vh',
        }
        
      
      };
      

const DynamicParametersScreen = () => {
 const [equipo, setEquipo] = useState(null);
 const [isEquipoGetted, setIsEquipoGetted] = useState(false);

 const hospitalCode = useStore((state) => state.hospitalCode);
 const { codigoIdentificacion } = useParams();
const [inputs, setInputs] = useState({});
const handleSave = async () => {
  try {
    const response = await axios.put(
      `${url.url}/hojavida/${hospitalCode}/${codigoIdentificacion}`,
      inputs
    );
    if (response.status === 200) {
      alert("Parámetros guardados correctamente");
    } else {
      alert("Error al guardar los datos");
    }
  } catch (error) {
    console.error("Error guardando los datos:", error);
    alert("Ocurrió un error al guardar los datos");
  }
};

 const getEquipo = async (codigoIdentificacion: string) => {
     try {
       const response = await axios.get(
         `${url.url}/hojavida/${hospitalCode}/${codigoIdentificacion}`
       );
       if (response.status === 200) {
         setIsEquipoGetted(true);
         setEquipo(response.data);
         console.log("Equipo:", response.data); // Verifica la respuesta
       }
     } catch (error) {
       console.error("Error obteniendo equipo:", error);
     }
   };
   useEffect(() => {
    const fetchData = async () => {
      await getEquipo(codigoIdentificacion);
    };
  
    fetchData();
  
    if (isEquipoGetted && equipo) {
      setInputs(equipo);
    }
  }, [codigoIdentificacion, isEquipoGetted,]);
  
  const handleInputChange = (key, value) => {
    try {
      const parsedValue = JSON.parse(value);
      setInputs({ ...inputs, [key]: parsedValue });
    } catch {
      setInputs({ ...inputs, [key]: value });
    }
  };
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Parámetros Técnicos</h1>
      {isEquipoGetted && Object.keys(equipo).map((key, index) => (
  <motion.div 
    key={key}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    style={styles.card}>
    <label style={styles.label}>{key}</label>
    <input
      style={styles.input}
      value={typeof inputs[key] === "object" ? JSON.stringify(inputs[key], null, 2) : inputs[key] || ""}

      placeholder={`Ingrese ${key}`}
      onChange={(e) => handleInputChange(key, e.target.value)}
    />
  </motion.div>
))}


<button
  style={styles.modernButton}
  onClick={handleSave}
  onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
  onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}>
  Guardar
</button>

    </div>
  );
};

export default DynamicParametersScreen;