import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./SidebarInfos.module.css";
import { XIcon } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

const trends = [
  { id: 1, category: "Promoção Nivea", topic: "Nivea no BBB" },
  { id: 2, category: "Esportes - Assunto do Momento", topic: "Neto" },
  { id: 3, category: "Assunto do momento em Brasil", topic: "Yoko" },
  {
    id: 4,
    category: "Reallity Show - Assunto do momento",
    topic: "Castigo do monstro",
  },
  {
    id: 5,
    category: "Tecnologia - Trending",
    topic: "Lançamento do QuantumPhone",
  },
  {
    id: 6,
    category: "Música - Assunto do Momento",
    topic: "Nova música da Luma",
  },
  { id: 7, category: "Política - Trending", topic: "Reforma Tributária" },
];

interface SidebarInfosProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function SidebarInfos({
  className,
  isOpen = false,
  onClose,
}: SidebarInfosProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  if (!isMobile) {
    return (
      <aside className={`${styles.sidebar} ${className || ""}`}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
        <div className={styles.trendsForYou}>
          <h3>Today's Trends</h3>
          {trends.map((trend) => (
            <div className={styles.trendForYouItem} key={trend.id}>
              <small>{trend.category}</small>
              <p>{trend.topic}</p>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : ""} ${className || ""}`}
      >
        <div className={styles.drawerHeader}>
          <h2>...</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <XIcon size={24} />
          </button>
        </div>

        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>

        <div className={styles.trendsForYou}>
          <h3>Today's Trends</h3>
          {trends.map((trend) => (
            <div className={styles.trendForYouItem} key={trend.id}>
              <small>{trend.category}</small>
              <p>{trend.topic}</p>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
