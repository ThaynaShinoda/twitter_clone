/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { ChatCircleIcon, HeartIcon } from "@phosphor-icons/react";

import styles from "./FeedPage.module.css";
import { CommentModal } from "../../components/CommentModal/CommentModal";
import defaultProfile from "../../assets/default_profile_normal_blue.png";
import type { Post } from "../../types/Post";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";

export function FeedPage() {
  const { user } = useAuth();
  const [tweet, setTweet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentModal, setCommentModal] = useState<{
    open: boolean;
    postId: number | null;
    tweet?: { username: string; avatar?: string; content: string };
  }>({ open: false, postId: null, tweet: undefined });

  async function fetchFeed() {
    const response = await api.get("feed/");
    setPosts(response.data);
  }

  useEffect(() => {
    fetchFeed();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post("posts/", { content: tweet });
      await fetchFeed();
      setTweet("");
    } catch (err) {
      setError("Erro ao enviar tweet.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeed();
  }, []);

  async function handleLike(postId: number) {
    await api.post(`posts/${postId}/like/`);
    await fetchFeed();
  }

  return (
    <div className={styles.container}>
      <h3>Home</h3>
      <div className={styles.tweetBox}>
        <img
          src={user?.avatar || defaultProfile}
          alt="Avatar"
          className={styles.avatar}
        />
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.textBox}>
            <textarea
              name="content"
              value={tweet}
              placeholder="O que está acontecendo ?"
              className={styles.textarea}
              onChange={(e) => setTweet(e.target.value)}
              maxLength={280}
            />
            <div
              style={{
                textAlign: "right",
                color: tweet.length > 260 ? "red" : "#888",
                fontSize: "0.9rem",
                marginRight: "1rem",
              }}
            >
              {tweet.length}/280
            </div>
          </div>
          <button
            type="submit"
            className={styles.button}
            disabled={loading || tweet.length === 0}
          >
            {loading ? "..." : "Tweet"}
          </button>
          {error && <div>{error}</div>}
        </form>
      </div>

      {posts.map((post) => (
        <div key={post.id} className={styles.postsItem}>
          <img
            src={post.avatar || defaultProfile}
            alt="Avatar"
            className={styles.postsAvatar}
          />
          <div className={styles.postsTweet}>
            <Link
              to={`/posts/${post.id}/`}
              className={styles.postLink}
            >
              <div className={styles.postsUsername}>
                <b>@{post.username}</b>
                <span>{formatDate(post.created_at)}</span>
              </div>
              <p>{post.content}</p>
            </Link>
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
      <CommentModal
        open={commentModal.open}
        postId={commentModal.postId}
        tweet={commentModal.tweet}
        onClose={() =>
          setCommentModal({ open: false, postId: null, tweet: undefined })
        }
        onCommentSuccess={fetchFeed}
      />
    </div>
  );
}
