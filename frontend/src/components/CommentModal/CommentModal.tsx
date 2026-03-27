import { useState } from "react";
import styles from "./CommentModal.module.css";
import api from "../../services/api";
import defaultProfile from "../../assets/default_profile_normal_blue.png"

interface CommentModalProps {
  open: boolean;
  postId: number | null;
  tweet?: {
    username: string;
    avatar?: string;
    content: string;
  };
  onClose: () => void;
  onCommentSuccess?: () => void;
}

export function CommentModal({
  open,
  postId,
  onClose,
  onCommentSuccess,
  tweet,
}: CommentModalProps) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!postId) return;
    setLoading(true);
    setError(null);

    try {
      await api.post(`posts/${postId}/comments/`, { content: comment });
      setComment("");

      if (onCommentSuccess) onCommentSuccess();
      onClose();
    } catch {
      setError("Erro ao comentar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.modal}>
      <button onClick={onClose} className={styles.closeButton}>
        X
      </button>
      {tweet && (
        <div className={styles.tweetPreview}>
          <img src={tweet.avatar || defaultProfile} alt="Avatar" />
          <div className={styles.usernameAndContent}>
            <b>@{tweet.username}</b>
            <p>{tweet.content}</p>
          </div>
        </div>
      )}
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={loading}
          className={styles.textarea}
          placeholder="Faça um comentário"
          maxLength={280}
        />
        <button
          className={styles.button}
          type="submit"
          disabled={loading || comment.length === 0}
        >
          {loading ? "Comentando..." : "Comentar"}
        </button>
      </form>
      {error && <div>{error}</div>}
    </div>
  );
}
