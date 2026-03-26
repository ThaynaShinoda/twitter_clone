import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import defaultProfile from "../../assets/default_profile_normal_blue.png";
import styles from "./EditModal.module.css";
import type { User } from "../../types/User";

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  user: Pick<User, "bio" | "avatar"> | null;
  onSave: (data: { bio: string; avatar?: File }) => Promise<void>;
}

export function EditModal({ open, onClose, onSave, user }: EditModalProps) {
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState<File | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSave({ bio, avatar });
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
        <h2>Editar perfil</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Bio:
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={styles.textarea}
              placeholder="Conte um pouco sobre voce"
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
            Novo avatar: 
            {" "}<input type="file" accept="image/*" onChange={handleAvatarChange} />
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
      </div>
    </div>
  );
}
