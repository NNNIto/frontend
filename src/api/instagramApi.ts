// src/api/instagramApi.ts
import { apiClient } from "./axiosClient";
import type {
  ActivityItemDto,
  CommentDto,
  FollowUserDto,
  PostDto,
  ProfileHeaderDto,
  ProfilePostDto,
  ShareUserDto,
  SimpleUserDto,
  StoryDto,
  UpdateProfileRequestDto,
} from "./types";

// ---- server-side DTO types (wire format) ----
type ServerFeedResponse = {
  items: Array<{
    id: number;
    authorId: number;
    authorName: string;
    authorAvatarUrl: string;
    imageUrl: string;
    caption: string;
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    createdAt: string;
  }>;
  page: number;
  pageSize: number;
  totalCount: number;
};

type ServerPostDetail = {
  id: number;
  imageUrl: string;
  caption: string;
  authorId: number;
  authorName: string;
  authorAvatarUrl: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: string;
  comments: Array<{
    id: number;
    userId: number;
    userName: string;
    text: string;
    createdAt: string;
  }>;
};

type ServerUserSummary = {
  userId: number;
  userName: string;
  displayName: string;
  avatarUrl: string;
};

type ServerStory = {
  id: number;
  userId: number;
  userName: string;
  avatarUrl: string;
  isViewed: boolean;
};

type ServerActivity = {
  id: number;
  type: string;
  fromUserId: number;
  fromUserName: string;
  fromUserAvatarUrl: string;
  postId?: number | null;
  createdAt: string;
};

type ServerProfileHeader = {
  userId: number;
  userName: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
};

type ServerProfilePost = {
  id: number;
  thumbnailUrl: string;
  likeCount: number;
  commentCount: number;
};

// ---- mappers ----
function mapFeedItemToPostDto(p: ServerFeedResponse["items"][number]): PostDto {
  return {
    id: String(p.id),
    userName: p.authorName,
    avatarUrl: p.authorAvatarUrl,
    imageUrl: p.imageUrl,
    caption: p.caption,
    likeCount: p.likeCount,
    commentCount: p.commentCount,
    likedByCurrentUser: p.isLiked,
    createdAtText: new Date(p.createdAt).toLocaleString(),
  };
}

function mapUser(u: ServerUserSummary): SimpleUserDto {
  return {
    id: String(u.userId),
    userName: u.userName,
    displayName: u.displayName,
    avatarUrl: u.avatarUrl,
  };
}

// ---- API calls ----

/** Feed (Home) */
export async function fetchFeed(page = 1, pageSize = 20): Promise<PostDto[]> {
  const res = await apiClient.get<ServerFeedResponse>("/api/feed", {
    params: { page, pageSize },
  });
  return res.data.items.map(mapFeedItemToPostDto);
}

/** Stories */
export async function fetchStories(): Promise<StoryDto[]> {
  const res = await apiClient.get<ServerStory[]>("/api/story");
  return res.data.map((s) => ({
    id: String(s.id),
    userId: String(s.userId),
    userName: s.userName,
    avatarUrl: s.avatarUrl,
    isViewed: s.isViewed,
  }));
}

/** Story detail by id */
export async function fetchStoryById(storyId: string) {
  const res = await apiClient.get<{
    id: number;
    userId: number;
    userName: string;
    avatarUrl: string;
    imageUrl: string;
    isViewed: boolean;
    createdAt: string;
    expiresAt: string;
  }>(`/api/story/${storyId}`);
  const s = res.data;
  return {
    id: String(s.id),
    userId: String(s.userId),
    userName: s.userName,
    avatarUrl: s.avatarUrl,
    imageUrl: s.imageUrl,
    isViewed: s.isViewed,
    createdAt: s.createdAt,
    expiresAt: s.expiresAt,
  };
}

/** Toggle like */
export async function toggleLike(postId: string): Promise<void> {
  await apiClient.post(`/api/post/${postId}/like`);
}

/** Post detail (for Post.tsx expansion & CommentSheet) */
export async function fetchPost(postId: string): Promise<PostDto> {
  const res = await apiClient.get<ServerPostDetail>(`/api/post/${postId}`);
  const p = res.data;
  return {
    id: String(p.id),
    userName: p.authorName,
    avatarUrl: p.authorAvatarUrl,
    imageUrl: p.imageUrl,
    caption: p.caption,
    likeCount: p.likeCount,
    commentCount: p.commentCount,
    likedByCurrentUser: p.isLiked,
    createdAtText: new Date(p.createdAt).toLocaleString(),
    detailSections: [], // backend does not provide restaurant sections yet
  };
}

/** Comments (backend returns inside post detail) */
export async function fetchComments(postId: string): Promise<CommentDto[]> {
  const detail = await fetchPost(postId);
  // fetchPost doesn't include comments in PostDto; call server directly:
  const res = await apiClient.get<ServerPostDetail>(`/api/post/${postId}`);
  return res.data.comments.map((c) => ({
    id: String(c.id),
    userId: String(c.userId),
    userName: c.userName,
    text: c.text,
    createdAt: c.createdAt,
  }));
}

/** Add comment (backend not implemented yet) */
export async function addComment(_postId: string, _text: string): Promise<void> {
  // TODO: implement backend endpoint. For now, no-op to avoid UI crash.
  return;
}

/** Toggle comment like (backend not implemented yet) */
export async function toggleCommentLike(_postId: string, _commentId: string): Promise<void> {
  return;
}

/** Activity (notifications) */
export async function fetchActivity(page = 1, pageSize = 30): Promise<ActivityItemDto[]> {
  const res = await apiClient.get<ServerActivity[]>("/api/activity", {
    params: { page, pageSize },
  });
  return res.data.map((a) => ({
    id: String(a.id),
    type: a.type,
    fromUserId: String(a.fromUserId),
    fromUserName: a.fromUserName,
    fromUserAvatarUrl: a.fromUserAvatarUrl,
    postId: a.postId != null ? String(a.postId) : null,
    createdAt: a.createdAt,
  }));
}

/** Follow lists */
export async function fetchFollowers(): Promise<FollowUserDto[]> {
  const res = await apiClient.get<ServerUserSummary[]>("/api/follow/followers");
  return res.data.map(mapUser);
}

export async function fetchFollowing(): Promise<FollowUserDto[]> {
  const res = await apiClient.get<ServerUserSummary[]>("/api/follow/following");
  return res.data.map(mapUser);
}

/** Share suggestions */
export async function fetchShareSuggestions(): Promise<ShareUserDto[]> {
  const res = await apiClient.get<ServerUserSummary[]>("/api/share/suggestions");
  return res.data.map(mapUser);
}

/** Profile */
export async function fetchCurrentProfile(): Promise<ProfileHeaderDto> {
  const res = await apiClient.get<ServerProfileHeader>("/api/profile/me");
  const p = res.data;
  return {
    userId: String(p.userId),
    userName: p.userName,
    displayName: p.displayName,
    bio: p.bio,
    avatarUrl: p.avatarUrl,
    postCount: p.postCount,
    followerCount: p.followerCount,
    followingCount: p.followingCount,
  };
}

export async function fetchMyPosts(): Promise<ProfilePostDto[]> {
  const res = await apiClient.get<ServerProfilePost[]>("/api/profile/me/posts");
  return res.data.map((p) => ({
    id: String(p.id),
    thumbnailUrl: p.thumbnailUrl,
    likeCount: p.likeCount,
    commentCount: p.commentCount,
  }));
}

export async function updateMyProfile(req: UpdateProfileRequestDto): Promise<void> {
  await apiClient.put("/api/profile/me", req);
}

/** Search (backend has no dedicated search endpoint; do local search over feed + suggestions) */
export async function searchAll(keyword: string): Promise<{ users: SimpleUserDto[]; posts: PostDto[] }> {
  const q = keyword.trim();
  if (!q) return { users: [], posts: [] };

  const [feed, users] = await Promise.all([
    fetchFeed(1, 50),
    fetchShareSuggestions(),
  ]);

  const qLower = q.toLowerCase();
  const filteredPosts = feed.filter(
    (p) => p.caption.toLowerCase().includes(qLower) || p.userName.toLowerCase().includes(qLower)
  );
  const filteredUsers = users.filter(
    (u) => u.userName.toLowerCase().includes(qLower) || u.displayName.toLowerCase().includes(qLower)
  );

  return { users: filteredUsers, posts: filteredPosts };
}
