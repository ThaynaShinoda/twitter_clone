import { Link } from "react-router-dom"
import logo_bird from "../../assets/twitter_logo_bird.svg"
import styles from "./LoginPage.module.css"

export function LoginPage(){
  return (
    <div className={styles.container}>
      <img src={logo_bird} alt="Logo bird blue" className={styles.logo}/>
      <h1>Log in to Twitter</h1>
      <form className={styles.form}>
        <input className={styles.input} type="email" name="" id="" placeholder="Email address" />
        <input className={styles.input} type="password" name="" id="" placeholder="Password" />
        <button className={styles.button} type="submit">Log in</button>
      </form>
      <Link className={styles.signUp} to="/register">Sign up for Twitter</Link>
    </div>
  )
}