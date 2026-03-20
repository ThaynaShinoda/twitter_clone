/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";

import LogoBird from "../../assets/twitter_logo_bird.svg?react";
import styles from "./LoginPage.module.css";
import { AuthForm } from "../../components/AuthForm/AuthForm";
import type { FieldProps } from "../../hooks/useForm";
import { useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const loginFields: FieldProps[] = [
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

export function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(values: Record<string, string>) {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login/", values);
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
      <LogoBird className={styles.logo} />

      <h1>Log in to Twitter</h1>
      {error && <div>{error}</div>}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <AuthForm
          fields={loginFields}
          submitText="Login"
          onSubmit={handleLogin}
        />
      )}
      <Link className={styles.signUpLink} to="/register">
        Sign up for Twitter
      </Link>
    </div>
  );
}
