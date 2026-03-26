import styles from "./ProfilePage.module.css";
import defaultProfile from "../../assets/default_profile_normal_blue.png";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { ChatCircleIcon, HeartIcon } from "@phosphor-icons/react";
import { CommentModal } from "../../components/CommentModal/CommentModal";
import type { Post } from "../../types/Post";
import { EditModal } from "../../components/EditModal/EditModal";

export function ProfilePage() {
  const { user, setUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentModal, setCommentModal] = useState<{
    open: boolean;
    postId: number | null;
    tweet?: { username: string; avatar?: string; content: string };
  }>({ open: false, postId: null, tweet: undefined });
  const [editModalOpen, setEditModalOpen] = useState(false);

  async function fetchMyPosts() {
    try {
      const response = await api.get("my-posts/");
      setPosts(response.data);
    } catch (err) {
      console.error("Erro ao carregar posts", err);
    }
  }

  useEffect(() => {
    async function loadPosts() {
      await fetchMyPosts();
    }
    loadPosts();
  }, []);

  async function handleLike(postId: number) {
    await api.post(`posts/${postId}/like/`);
    await fetchMyPosts();
  }

  async function handleSaveProfile(data: { bio: string; avatar?: File }) {
    const formData = new FormData();
    formData.append("bio", data.bio);

    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }

    await api.patch("profile/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const profileResponse = await api.get("profile/");
    setUser(profileResponse.data);
  }

  return (
    <>
      <div className={styles.container}>
        <h3>Profile</h3>
        <div className={styles.infoContainer}>
          <div className={styles.background}>
            <div className={styles.profileHeader}>
              <div className={styles.avatarUsername}>
                <img
                  src={user?.avatar || defaultProfile}
                  alt="Avatar"
                  className={styles.avatar}
                />
                <p>@{user?.username}</p>
              </div>

              <button
                className={styles.editButton}
                onClick={() => setEditModalOpen(true)}
              >
                Edit
              </button>
            </div>
          </div>
          <div className={styles.bioContainer}>
            {user?.bio}
            <div className={styles.countContainer}>
              <span>{user?.following_count}</span> Following{" "}
              <span>{user?.followers_count}</span> Followers
            </div>
          </div>
        </div>
        <div className={styles.postsContainer}>
          <h4>Posts</h4>
          <div>
            {posts.map((post) => (
              <div key={post.id} className={styles.postsItem}>
                <img
                  src={post.avatar || defaultProfile}
                  alt="Avatar"
                  className={styles.postsAvatar}
                />
                <div className={styles.postsTweet}>
                  <div className={styles.postsUsername}>
                    <b>@{post.username}</b>
                    <span>7m</span>
                  </div>
                  <p>{post.content}</p>
                  <div className={styles.commentsAndLikes}>
                    <div>
                      <ChatCircleIcon
                        size={24}
                        onClick={() =>
                          setCommentModal({
                            open: true,
                            postId: post.id,
                            tweet: {
                              username: post.username,
                              avatar: post.avatar,
                              content: post.content,
                            },
                          })
                        }
                        style={{ cursor: "pointer" }}
                      />
                      <span>{post.comments_count}</span>
                    </div>
                    <div
                      onClick={() => handleLike(post.id)}
                      style={{ cursor: "pointer" }}
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
            ))}
          </div>
        </div>
      </div>
      <CommentModal
        open={commentModal.open}
        postId={commentModal.postId}
        tweet={commentModal.tweet}
        onClose={() =>
          setCommentModal({ open: false, postId: null, tweet: undefined })
        }
        onCommentSuccess={fetchMyPosts}
      />
      <EditModal
        key={`${editModalOpen}-${user?.bio ?? ""}-${user?.avatar ?? ""}`}
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={user ?? null}
        onSave={handleSaveProfile}
      />
    </>
  );
}
