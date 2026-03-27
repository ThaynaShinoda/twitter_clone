import { useParams } from "react-router-dom";
import styles from "./PostPage.module.css";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { type Post } from "../../types/Post";
import defaultProfile from "../../assets/default_profile_normal_blue.png";
import { HeartIcon, TrashIcon } from "@phosphor-icons/react";
import { formatDate } from "../../utils/formatDate";
import { useAuth } from "../../context/AuthContext";

type Comment = {
  id: number;
  user_id: number;
  username: string;
  avatar?: string;
  content: string;
  created_at: string;
};

export function PostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const postResponse = await api.get(`posts/${id}/`);
      setPost(postResponse.data);

      const commentsResponse = await api.get(`posts/${id}/comments/`);
      setComments(commentsResponse.data);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const [likeLoading, setLikeLoading] = useState(false);

  async function handleLike(postId: number) {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      await api.post(`posts/${postId}/like/`);
      const postResponse = await api.get(`posts/${postId}/`);
      setPost(postResponse.data);
    } catch {
      alert("Erro ao curtir o post.");
    } finally {
      setLikeLoading(false);
    }
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!post) {
    return <div>Post não encontrado.</div>;
  }

  async function handleDeleteComment(commentId: number) {
    if (!post) return;
    if (!window.confirm("Tem certeza que deseja deletar esse comentário?"))
      return;
    try {
      await api.delete(`posts/${post.id}/comments/${commentId}/`);
      const commentsResponse = await api.get(`posts/${post.id}/comments/`);
      setComments(commentsResponse.data);
    } catch {
      alert("Erro ao deletar comentário.");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.tweetPreview}>
        <img src={post.avatar || defaultProfile} alt="Avatar" />
        <div>
          <div className={styles.usernameAndContent}>
            <b>@{post.username}</b>
            <p>{post.content}</p>
          </div>
          <div className={styles.likesAndCreated}>
            <span>{formatDate(post.created_at)}</span>
            <div
              onClick={() => handleLike(post.id)}
              className={styles.likeButton}
            >
              <HeartIcon
                size={24}
                color={post.is_liked ? "red" : "var(--gray-300)"}
                weight={post.is_liked ? "fill" : "regular"}
              />
              <span>{post.likes_count}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.commentsContainer}>
        <h4>Comments</h4>
        {comments.length === 0 && <p>Não existe comentários.</p>}
        {comments.map((comment) => (
          <div key={comment.id} className={styles.commentsItem}>
            <img
              src={comment.avatar || defaultProfile}
              alt="Avatar"
              className={styles.avatar}
            />
            <div className={styles.usernameAndContent}>
              <b>@{comment.username}</b>
              <p>{comment.content}</p>
              <div className={styles.dateAndDelete}>
                <p className={styles.date}>{formatDate(comment.created_at)}</p>
                {user && comment.user_id === user.id && (
                  <div
                    onClick={() => handleDeleteComment(comment.id)}
                    className={styles.deleteButton}
                    title="Deletar comentário"
                  >
                    <TrashIcon
                      size={20}
                      color="var(--gray-300)"
                      weight="regular"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
