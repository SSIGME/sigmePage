import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import url from "../../url.json";
import useStore from "../../src/utils/useStore";
import "./MantenimientosFecha.css";

interface userFirma {
  area?: string;
  tipo: string;
  firma: string;
  nombre?: string;
}
interface HospitalData {
  nombre: string;
  direccion: string;
  telefono: string;
  nit: string;
  logoHospital: string | null;
}
const MantenimientosFecha = () => {
  const logoEmpresa =
    "https://storage.googleapis.com/sigme-resources/LOGOS/Empresa.png";
  const logoSigme =
    "https://storage.googleapis.com/sigme-resources/LOGOS/Sigme.png";
  const hospitalCode = useStore((state) => state.hospitalCode);
  const [hospitalData, setHospitalData] = useState<HospitalData | null>(null);
  const [startDate, setStartDate] = useState("2025-11-24");
  const [userFirma, setUserFirma] = useState<userFirma | null>(null);
  const [endDate, setEndDate] = useState("2025-12-31");
  const [preventivo, setPreventivo] = useState("");
  const [correctivo, setCorrectivo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const response = await axios.get(`${url.url}/hospital/${hospitalCode}`);
        if (response.status === 200) {
          setHospitalData(response.data);
          console.log("Datos del hospital:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener datos del hospital:", error);
      }
    };

    fetchHospitalData();
  }, [hospitalCode]);
  // 1. Cargar imagen estática (Logos)
  const getImageData = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => resolve(null);
    });
  };

  /**
   * 2. CORRECCIÓN CRÍTICA: Convertir Path Data a Imagen PNG
   */
  const svgToPngBase64 = (signatureData) => {
    return new Promise((resolve) => {
      try {
        if (!signatureData) {
          resolve(null);
          return;
        }
        let finalSvg = signatureData;
        // Si los datos empiezan con 'M', es solo el path data, no un SVG completo.
        if (signatureData.trim().startsWith("M")) {
          // ViewBox ajustado a los datos estándar de firmas
          finalSvg = `
          <svg viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
            <path d="${signatureData}" stroke="black" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"
            transform="rotate(-90, 343.6, 530.6) translate(200, 140) scale(1.7, 1.3)"/>
          </svg>`;
        } else if (!signatureData.includes("<svg")) {
          finalSvg = `<svg xmlns="http://www.w3.org/2000/svg">${signatureData}</svg>`;
        }

        const img = new Image();
        const svg64 = btoa(unescape(encodeURIComponent(finalSvg)));
        const b64Start = "data:image/svg+xml;base64,";
        img.src = b64Start + svg64;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          // Tamaño suficiente para que no se pixele
          canvas.width = 300;
          canvas.height = 150;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, 300, 150);
          resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = (e) => {
          console.warn("Error al renderizar firma SVG", e);
          resolve(null);
        };
      } catch (error) {
        console.error("Error procesando firma", error);
        resolve(null);
      }
    });
  };

  // // Normalizador de texto
  // const normalizar = (str: unknown): string => {
  //   if (typeof str !== "string") return "";
  //   return str
  //     .toLowerCase()
  //     .normalize("NFKD")
  //     .replace(/[\u0300-\u036f]/g, "")
  //     .replace(/\s+/g, " ")
  //     .trim();
  // };
  // Función auxiliar para rotar imagen

  // Uso en tu código
  // Función de normalización (asegúrate de tenerla fuera o dentro del componente)
  const normalizar = (str) => {
    if (!str) return "";
    return str
      .toString()
      .toLowerCase() // Minusculas
      .normalize("NFD") // Descompone caracteres (á -> a + ´)
      .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos (tildes)
      .replace(/\s+/g, " ") // Convierte múltiples espacios en uno solo
      .trim(); // Quita espacios al inicio y final
  };
  const generarPDF = async (data, firmasData) => {
    const doc = new jsPDF();

    // URLs de logos remotos
    const logoEmpresaUrl =
      "https://storage.googleapis.com/sigme-resources/LOGOS/Empresa.png";
    const logoSigmeUrl =
      "https://storage.googleapis.com/sigme-resources/LOGOS/Sigme.png";

    // Cargar logos desde URLs
    const logoSigmeData = await getImageData(logoSigmeUrl);
    const logoEmpresaData = await getImageData(logoEmpresaUrl);
    const logoHospitalData = hospitalData?.logoHospital
      ? await getImageData(hospitalData.logoHospital)
      : null;

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // --- Encabezado con 3 Logos ---
    // Logo Sigme (izquierda)
    if (logoSigmeData) {
      // Aumentar el ancho del logo para ocupar más espacio horizontal
      const logoWidth = 40; // ajustar ancho según se necesite
      const logoHeight = 15; // mantener una altura razonable
      doc.addImage(logoSigmeData, "PNG", 14, 10, logoWidth, logoHeight);
    }

    // Logo Empresa (centro-derecha)
    if (logoEmpresaData) {
      doc.addImage(logoEmpresaData, "PNG", pageWidth / 2 - 15, 10, 30, 20);
    }

    // Logo Hospital (derecha)
    if (logoHospitalData) {
      doc.addImage(logoHospitalData, "PNG", pageWidth - 44, 10, 30, 20);
    }
    // Espacio extra para separar logos del contenido
    const headerOffset = 14;

    // Título principal
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      "ACTA DE ENTREGA DE MANTENIMIENTO",
      pageWidth / 2,
      35 + headerOffset,
      { align: "center" }
    );

    // Subtítulo
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("GENERADA POR SIGME", pageWidth / 2, 41 + headerOffset, {
      align: "center",
    });

    // Línea separadora
    doc.line(14, 46 + headerOffset, pageWidth - 14, 46 + headerOffset);

    // --- Información del Hospital (desde hospitalData) ---
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    let yPos = 54 + headerOffset;
    const lineHeight = 5.5;

    const addInfoLine = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(value || "N/A", 70, yPos);
      yPos += lineHeight;
    };

    // Usar hospitalData si está disponible, si no usar valores por defecto
    addInfoLine("Institución / Cliente", hospitalData?.nombre || "N/A");
    addInfoLine("Dirección", hospitalData?.direccion || "N/A");
    addInfoLine("Teléfono", hospitalData?.telefono || "N/A");
    addInfoLine("NIT", hospitalData?.nit || "N/A");
    addInfoLine("Fecha de Visita", `${startDate} al ${endDate}`);
    addInfoLine("Empresa Responsable", "Rubén Ospina");

    yPos += 5;

    // --- Agrupar equipos por Área ---
    const equiposPorArea = data.reduce((acc, item) => {
      const areaRaw = item.area || item.ubicacion || "Sin Ubicación";
      if (!acc[areaRaw]) acc[areaRaw] = [];
      acc[areaRaw].push(item);
      return acc;
    }, {});

    yPos += 5;

    // 1. Preparar mapa de firmas (Manejar ARRAYS de áreas)
    const userFirmas = firmasData?.userFirmas || [];
    const mapaFirmasArea = {};

    userFirmas
      .filter((f) => f.tipo === "responsableArea")
      .forEach((f) => {
        // f.area puede ser un string O un array de strings
        let areas = [];

        if (Array.isArray(f.area)) {
          // Si es array, usa directamente
          areas = f.area;
        } else if (typeof f.area === "string") {
          // Si es string, divídelo por comas
          areas = f.area.split(",").map((a) => a.trim());
        }

        // Normalizar y guardar cada área con la misma firma
        areas.forEach((area) => {
          const areaKey = normalizar(area);
          mapaFirmasArea[areaKey] = f.firma;
        });
      });

    // Procesar cada área
    for (const areaNombreOriginal of Object.keys(equiposPorArea)) {
      // Control de salto de página
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Título del área
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(230, 230, 230);
      doc.text(areaNombreOriginal.toUpperCase(), 14, yPos);
      yPos += 5;

      // ---------------------------------------------------------
      // PROCESAMIENTO DE FIRMA (Normalizado + Manejo de Arrays)
      // ---------------------------------------------------------

      // 1. Normalizar el nombre del área actual
      const areaKey = normalizar(areaNombreOriginal);
      let firmaAreaImg = null;

      if (mapaFirmasArea[areaKey]) {
        // Convertir SVG a PNG
        firmaAreaImg = await svgToPngBase64(mapaFirmasArea[areaKey]);
      }

      // Preparar datos de la tabla
      const bodyData = equiposPorArea[areaNombreOriginal].map((equipo) => {
        return [
          "1",
          equipo.tipo || equipo.nombre || "",
          equipo.marca || "",
          equipo.modelo || "",
          equipo.serie || equipo.numeroSerie || "",
          equipo.observaciones || "Ninguna",
          firmaAreaImg || null,
        ];
      });

      // Generar tabla
      autoTable(doc, {
        startY: yPos,
        head: [
          [
            "CANTIDAD",
            "TIPO",
            "MARCA",
            "MODELO",
            "SERIE",
            "OBSERVACIONES",
            "FIRMA",
          ],
        ],
        body: bodyData,
        theme: "grid",
        headStyles: {
          fillColor: [200, 200, 200],
          textColor: 20,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 8,
          cellPadding: 2,
          valign: "middle",
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 15 },
          5: { cellWidth: 40, halign: "left" },
          6: { cellWidth: 30, minCellHeight: 15 },
        },
        // Limpiar texto de celda imagen
        didParseCell: (data) => {
          if (data.section === "body" && data.column.index === 6) {
            data.cell.text = "";
          }
        },
        // Dibujar imagen
        didDrawCell: (data) => {
          if (data.section === "body" && data.column.index === 6) {
            const imgFinal = data.row.raw[6];

            if (imgFinal) {
              try {
                // Padding mínimo para maximizar tamaño
                const paddingX = 1;
                const paddingY = 0.5;

                const availableWidth = data.cell.width - paddingX * 2;
                const availableHeight = data.cell.height - paddingY * 2;

                doc.addImage(
                  imgFinal,
                  "PNG",
                  data.cell.x + paddingX,
                  data.cell.y + paddingY,
                  availableWidth,
                  availableHeight,
                  undefined,
                  "FAST"
                );
              } catch (e) {
                console.warn("Error dibujando firma", e);
              }
            }
          }
        },
      });

      yPos = doc.lastAutoTable.finalY + 15;
    }

    doc.save(
      `Acta_Mantenimiento_${
        hospitalData?.nombre || hospitalCode
      }_${startDate}.pdf`
    );
  };

  const handleGenerarReporte = async () => {
    if (!startDate || !endDate) {
      alert("Por favor seleccione ambas fechas");
      return;
    }
    setLoading(true);

    try {
      // 1. Obtener Firmas
      let firmasRecuperadas = {};
      try {
        const resFirmas = await axios.get(
          `${url.url}/reports/firmas/${hospitalCode}`
        );
        if (resFirmas.status === 200) {
          firmasRecuperadas = resFirmas.data; // Guardamos todo el objeto data
        }
      } catch (err) {
        console.warn("Error cargando firmas", err);
      }

      // 2. Obtener Reporte
      const response = await axios.get(
        `${url.url}/reports/${hospitalCode}/mantenimientosFecha`,
        { params: { fechaInicio: startDate, fechaFin: endDate } }
      );

      if (response.status === 200 && response.data.length > 0) {
        await generarPDF(response.data, firmasRecuperadas);
      } else {
        alert("No se encontraron datos.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al generar reporte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-container">
      <div className="report-card">
        <h1 className="report-title">Reporte de Mantenimientos</h1>

        <div className="form-group">
          <label className="form-label">Fecha de inicio:</label>
          <input
            type="date"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fecha de fin:</label>
          <input
            type="date"
            className="form-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="form-group" style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label className="form-label">Valor Preventivo:</label>
            <input
              type="number"
              className="form-input"
              value={preventivo}
              onChange={(e) => setPreventivo(e.target.value)}
              placeholder="$0"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label className="form-label">Valor Correctivo:</label>
            <input
              type="number"
              className="form-input"
              value={correctivo}
              onChange={(e) => setCorrectivo(e.target.value)}
              placeholder="$0"
            />
          </div>
        </div>

        <button
          className="generate-btn"
          onClick={handleGenerarReporte}
          disabled={loading}
        >
          {loading ? "Generando..." : "Generar PDF"}
          {loading && <div className="loading-spinner"></div>}
        </button>
      </div>
    </div>
  );
};

export default MantenimientosFecha;
