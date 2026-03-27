export interface Post {
  id: number;
  username: string;
  avatar?: string;
  content: string;
  comments_count: number;
  likes_count: number;
  is_liked: boolean;
  created_at: string;
}