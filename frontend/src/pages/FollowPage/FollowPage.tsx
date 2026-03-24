import { useEffect, useState } from "react";
import api from "../../services/api";
import styles from "./FollowPage.module.css";
import defaultProfile from "../../assets/default_profile_normal_blue.png";
interface UserProps {
  id: number;
  username: string;
  avatar: string;
  is_following: string;
}

export function FollowPage() {
  const [users, setUsers] = useState<UserProps[]>([]);

  async function handleFollow(userId: number) {
    try {
      await api.post(`users/${userId}/follow/`);
      setUsers(
        users.map((u) =>
          u.id === userId
            ? { ...u, is_following: u.is_following ? "" : "true" }
            : u,
        ),
      );
    } catch (error) {
      console.error("Erro ao seguir/deixar de seguir", error);
    }
  }

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get("users/");
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários: ", error);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className={styles.container}>
      <h3>Follow Page</h3>
      <div className={styles.followList}>
        {users.map((user) => (
          <div key={user.id} className={styles.followItem}>
            <div>
              <img
                src={user.avatar || defaultProfile}
                alt="avatar"
                className={styles.avatar}
              />
              <p className={styles.username}>@{user.username}</p>
            </div>
            <button className={styles.followButton} onClick={() => handleFollow(user.id)}>
              {user.is_following ? "Seguindo" : "Seguir +"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
