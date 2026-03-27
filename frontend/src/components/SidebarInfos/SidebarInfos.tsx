import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./SidebarInfos.module.css";

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
  {
    id: 8,
    category: "Games - Assunto do Momento",
    topic: "Campeonato Valorant Brasil",
  },
  {
    id: 9,
    category: "Clima - Trending",
    topic: "Frente fria ao Sudeste",
  },
];

export function SidebarInfos() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }
  return (
    <aside className={styles.sidebar}>
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
