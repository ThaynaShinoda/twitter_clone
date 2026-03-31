import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import defaultProfile from "../../assets/default_profile_normal_blue.png";
import styles from "./EditModal.module.css";
import type { User } from "../../types/User";

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  user: Pick<User, "username" | "bio" | "avatar"> | null;
  onSave: (data: {
    bio?: string;
    avatar?: File;
    username?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<void>;
}

export function EditModal({ open, onClose, onSave, user }: EditModalProps) {
  const [tab, setTab] = useState<"profile" | "password">(() => "profile");

  // Profile tab states
  const [bio, setBio] = useState(() => user?.bio || "");
  const [username, setUsername] = useState(() => user?.username || "");
  const [avatar, setAvatar] = useState<File | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState(() => user?.avatar || "");

  // Password tab states
  const [currentPassword, setCurrentPassword] = useState(() => "");
  const [newPassword, setNewPassword] = useState(() => "");
  const [confirmPassword, setConfirmPassword] = useState(() => "");
  const [passwordError, setPasswordError] = useState(() => "");

  async function handleSubmitProfile(e: FormEvent) {
    e.preventDefault();
    await onSave({ bio, avatar, username });
    onClose();
  }

  async function handleSubmitPassword(e: FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("A nova senha deve ter pelo menos 8 caracteres");
      return;
    }

    await onSave({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    onClose();
  }

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    setAvatar(selectedFile);

    if (!selectedFile) {
      setAvatarPreview(user?.avatar || "");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    setAvatarPreview(previewUrl);
  }

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Editar conta</h2>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "profile" ? styles.active : ""}`}
            onClick={() => setTab("profile")}
          >
            Perfil
          </button>
          <button
            className={`${styles.tab} ${tab === "password" ? styles.active : ""}`}
            onClick={() => setTab("password")}
          >
            Senha
          </button>
        </div>

        {tab === "profile" && (
          <form onSubmit={handleSubmitProfile}>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu nome de usuário"
              />
            </label>

            <label>
              Bio:
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className={styles.textarea}
                placeholder="Conte um pouco sobre você"
              />
            </label>

            <div className={styles.avatarPreviewContainer}>
              <p>Avatar atual:</p>
              <img
                src={avatarPreview || defaultProfile}
                alt="Preview do avatar"
                className={styles.avatarPreview}
              />
            </div>

            <label>
              Novo avatar:{" "}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>

            <div className={styles.actions}>
              <button type="submit" className={styles.button}>
                Salvar
              </button>
              <button type="button" onClick={onClose} className={styles.button}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        {tab === "password" && (
          <form onSubmit={handleSubmitPassword}>
            <label>
              Senha atual:
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                required
              />
            </label>

            <label>
              Nova senha:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
                required
              />
            </label>

            <label>
              Confirmar nova senha:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
                required
              />
            </label>

            {passwordError && <p className={styles.error}>{passwordError}</p>}

            <div className={styles.actions}>
              <button type="submit" className={styles.button}>
                Alterar Senha
              </button>
              <button type="button" onClick={onClose} className={styles.button}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
