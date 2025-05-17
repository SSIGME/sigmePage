import React from "react";
import styles from "./slideNav.module.css";
import homeIcon from "../../src/assets/homeDashboard.png";
import qrIcon from "../../src/assets/qrDashboard.png";
import hospitalsIcon from "../../src/assets/hospitals.png";
import rutinasIcon from "../../src/assets/rutinas.png";
import equiposIcon from "../../src/assets/equiposDashboard.png";
import settingsIcon from "../../src/assets/settingsDashboard.png";
import indicatorsIcon from "../../src/assets/indicators.png";
import reportsIcon from "../../src/assets/report.png";
import logoIcon from "../../src/assets/logoDashborad.png";

const Sidebar = ({ activeComponent, setActiveComponent, navigate }) => {
  const menuItems = [
    { key: "home", icon: homeIcon, alt: "Inicio" },
    { key: "Qr", icon: qrIcon, alt: "Generar QR" },
    { key: "hospitals", icon: hospitalsIcon, alt: "Crear Hospital" },
    { key: "rutinas", icon: rutinasIcon, alt: "Rutinas" },
    { key: "equipos", icon: equiposIcon, alt: "Crear equipos", navigateTo: "/crear/equipos" },

    { key: "settings", icon: settingsIcon, alt: "Editar equipos" },
    { key: "indicators", icon: indicatorsIcon, alt: "Indicadores" },
    { key: "reports", icon: reportsIcon, alt: "Reportes" },
  ];

  return (
    <aside className={styles.sidebar}>
   
      <nav>
        <ul>
          {menuItems.map(({ key, icon, alt, navigateTo }) => (
  <li
  key={key}
  onClick={() => (navigateTo ? navigate(navigateTo) : setActiveComponent(key))}
  className={`${styles.menuItem} ${activeComponent === key ? styles.active : ""}`}
>
  <img className={styles.icon} src={icon} alt={alt} />
  <span className={styles.menuText}>{alt}</span> {/* Texto abajo */}
</li>

          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
