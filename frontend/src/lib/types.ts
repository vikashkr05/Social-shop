export interface User {
  id: string;
  username: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UserProfile extends User {
  postCount: number;
  followerCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

export interface Product {
  id: string;
  title?: string;
  imageUrl?: string;
  priceSnapshot?: number;
  originalUrl: string;
  siteName?: string;
  affiliateUrl: string;
}

export interface Post {
  id: string;
  caption?: string;
  createdAt: string;
  user: User;
  product: Product;
  likeCount: number;
  saveCount: number;
  liked: boolean;
  saved: boolean;
}

export interface FeedResponse {
  posts: Post[];
  nextCursor: number;
  hasMore: boolean;
}

export interface LinkMeta {
  title?: string;
  imageUrl?: string;
  priceSnapshot?: number;
  siteName?: string;
  originalUrl: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  last: boolean;
}