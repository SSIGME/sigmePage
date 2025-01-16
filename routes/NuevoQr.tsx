import React, { useEffect, useState, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import "./nuevoQr.css";
import logo from "../src/assets/logo.png";

const Dashboard = () => {
  const [url, setUrl] = useState("AE3RH2D4HG7D");
  const [fileExt, setFileExt] = useState("png");
  const [dotType, setDotType] = useState("dots");
  const [cornerType, setCornerType] = useState("square");
  const [cornerDotType, setCornerDotType] = useState("dot");
  const [dotColor, setDotColor] = useState("#00040f");
  const [cornerColor, setCornerColor] = useState("#000000");
  const [cornerDotColor, setCornerDotColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const ref = useRef(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    qrCodeRef.current = new QRCodeStyling({
      width: 250,
      height: 250,
      margin:4,
      image: logo,
      dotsOptions: {
        color: dotColor,
        type: dotType,
      },
      cornersSquareOptions: {
        type: cornerType,
        color: cornerColor,
      },
      cornersDotOptions: {
        type: cornerDotType,
        color: cornerDotColor,
      },
      backgroundOptions: {
        color: backgroundColor,
      },
      imageOptions: {
        imageSize: 0.3,
        margin: 0,
      },
      qrOptions: {
        errorCorrectionLevel: "H",
        typeNumber: 4,
      },
    });
    qrCodeRef.current.append(ref.current);
  }, []);

  useEffect(() => {
    qrCodeRef.current.update({
      data: url,
      dotsOptions: {
        color: dotColor,
        type: dotType,
      },
      cornersSquareOptions: {
        type: cornerType,
        color: cornerColor,
      },
      cornersDotOptions: {
        type: cornerDotType,
        color: cornerDotColor,
      },
      backgroundOptions: {
        color: backgroundColor,
      },
    });
  }, [url, dotColor, dotType, cornerType, cornerColor, cornerDotType, cornerDotColor, backgroundColor]);

  const onDownloadClick = () => {
    const fileName = url; // Cambia esto al nombre deseado
    qrCodeRef.current.download({ extension: fileExt, name: fileName });
  };

  return (
    <div className="containerDashboard">
      <div className="background"></div>
      <div className="containerContent">
    

        <div className="clienteDetailContainer2">
          <div className="modernForm">
            <div className="formRow">
              <label>URL: <br></br></label>
              <input value={url} onChange={(e) => setUrl(e.target.value)} className="inputBox" />
            </div>

            <div className="formRow">
              <label style={{width:"100%", marginBottom:"7px"}}>Formato:</label>
              <select onChange={(e) => setFileExt(e.target.value)} value={fileExt} className="selectBox">
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>

            <div className="formRow">
            <label style={{width:"100%", marginBottom:"7px"}}>Dot Type:</label>
              <select onChange={(e) => setDotType(e.target.value)} value={dotType} className="selectBox">
                <option value="dots">Dots</option>
                <option value="rounded">Rounded</option>
                <option value="classy">Classy</option>
                <option value="classy-rounded">Classy Rounded</option>
              </select>
            </div>
            <div style={{display:'flex'}}> 
            <div className="formRow">
              <label style={{width:"100%", marginBottom:"7px"}}>Dot Color:</label>
              <input type="color" value={dotColor} onChange={(e) => setDotColor(e.target.value)} className="colorPicker" />
            </div>
            <div className="formRow">
              <label style={{width:"100%", marginBottom:"7px"}}>Corner Color:</label>
              <input type="color" value={cornerColor} onChange={(e) => setCornerColor(e.target.value)} className="colorPicker" />
            </div>
            </div>
            <div className="formRow">
              <label style={{width:"100%", marginBottom:"7px"}}>Corner Type:</label>
              <select onChange={(e) => setCornerType(e.target.value)} value={cornerType} className="selectBox">
                <option value="square">Square</option>
                <option value="dot">Dot</option>
                <option value="extra-rounded">Extra Rounded</option>
              </select>
            </div>
<div style={{display:'flex'}}>     <div className="formRow">
              <label style={{width:"100%", marginBottom:"7px"}}>Corner Dot Color:</label>
              <input type="color" value={cornerDotColor} onChange={(e) => setCornerDotColor(e.target.value)} className="colorPicker" />
            </div>

            <div className="formRow">
              <label style={{width:"100%", marginBottom:"7px"}}>Background Color:</label>
              <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="colorPicker" />
            </div>
</div>
      

            <div className="formRow">
              <label style={{width:"100%", marginBottom:"7px"}}>Corner Dot Type:</label>
              <select onChange={(e) => setCornerDotType(e.target.value)} value={cornerDotType} className="selectBox">
                <option value="dot">Dot</option>
                <option value="square">Square</option>
              </select>
            </div>

       
            <button onClick={onDownloadClick} className="downloadButton">Descargar</button>
          </div>

          <div className="qr" ref={ref} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
