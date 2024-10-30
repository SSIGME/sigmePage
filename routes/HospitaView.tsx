
import { useNavigate } from "react-router-dom";

import "./HospitalView.css";
import { useLocation } from 'react-router-dom';

function AddHospital() {
  const navigate = useNavigate();

  const location = useLocation();
  const data = location.state || {};
  
  return (
    <div className="backgrounda">
      <div className="background"></div>
      
  
      
      <div className="clienteDetailContainer3 fadeIn">
      <h1   className="title1">Credenciales</h1>

        {/* Información de la contraseña de administrador */}
        <div className="infoContainer">
          <label className="label">Contraseña del Administrador:</label>
          <span className="value">{data.contrasenaAdministrador}</span>
        </div>

        {/* Información del código del hospital */}
        <div className="infoContainer">
          <label className="label">Código del Hospital:</label>
          <span className="value">{data.codigoHospital}</span>
          <h1 className="title">{data.msg}</h1>
        </div>
        <button  onClick={()=>{navigate("/")}} className="clienteButton1">
            Volver
          </button>
      </div>
      
    </div>
  );
}

export default AddHospital;
