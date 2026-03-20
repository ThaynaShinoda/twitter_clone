/* eslint-disable @typescript-eslint/no-explicit-any */
import LogoBird from "../../assets/twitter_logo_bird.svg?react";
import LogoTwitter from "../../assets/twitter_logo.svg?react";

import styles from "./RegisterPage.module.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthForm } from "../../components/AuthForm/AuthForm";
import type { FieldProps } from "../../hooks/useForm";
import api from "../../services/api";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const registerFields: FieldProps[] = [
  { name: "username", type: "text", placeholder: "Name", required: true },
  {
    name: "email",
    type: "email",
    placeholder: "Email address",
    required: true,
  },
  {
    name: "password",
    type: "password",
    placeholder: "Password",
    required: true,
    minLength: 8,
  },
];

export function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleRegister(values: Record<string, string>) {
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/register/", values);
      const response = await api.post("/auth/login/", {
        email: values.email,
        password: values.password,
      });
      const token = response.data.access;
      login(token);
      navigate("/feed");
    } catch (error: any) {
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response?.data) {
        setError(JSON.stringify(error.response.data));
      } else {
        setError("Erro inesperado. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        {error && <div>{error}</div>}
        <div className={styles.formContainerTwo}>
          <LogoBird className={styles.formLogo} />
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <AuthForm
              fields={registerFields}
              submitText="Sign up"
              onSubmit={handleRegister}
            />
          )}
          <p className={styles.loginText}>
            Already a member?
            <Link to="/" className={styles.loginLink}>
              {" "}
              Login
            </Link>
          </p>
        </div>
      </div>

      <aside className={styles.sideText}>
        <p className={styles.text}>It's what's happening</p>
        <div className={styles.logoBirdTwitter}>
          <LogoTwitter className={styles.sideLogoTwitter} />
          <LogoBird className={styles.sideLogoBird} />
        </div>
      </aside>
    </div>
  );
}
