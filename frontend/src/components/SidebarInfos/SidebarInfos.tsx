import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"
import styles from "./SidebarInfos.module.css"

export function SidebarInfos() {
  const { logout} = useAuth();
  const navigate = useNavigate()

  function handleLogout() {
    logout();
    navigate("/")
  }
  return(
    <aside className={styles.sidebar}>
      <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
      <div className={styles.trendsForYou}>
        <h3>O que está acontecendo</h3>
        <div className={styles.trendForYouItem}>
          <small>Promoção Nivea</small>
          <p>Nivea no BBB</p>
        </div>
        <div className={styles.trendForYouItem}>
          <small>Esportes - Assunto do Momento</small>
          <p>Neto</p>
        </div>
        <div className={styles.trendForYouItem}>
          <small>Assunto do momento em Brasil</small>
          <p>Yoko</p>
        </div>
        <div className={styles.trendForYouItem}>
          <small>Reallity Show - Assunto do momento</small>
          <p>Castigo do monstro</p>
        </div>
      </div>
    </aside>
  )
}