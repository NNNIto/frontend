// src/api/instagramApi.ts
import { apiClient } from './axiosClient'
import type { ActivityItemDto, PostDto, StoryDto, SimpleUserDto, UserDto, CommentDto, ProfileDto, FollowUserDto, ShareUserDto, ProfilePostDto, StoryDetailDto } from './types'

/**
 * ホームフィードを取得
 */
export async function fetchFeed(page: number, pageSize: number): Promise<PostDto[]> {
    const response = await apiClient.get<PostDto[]>('/api/feed', {
        params: { page, pageSize },
    })
    return response.data
}

/**
 * ユーザープロフィール
 */
export async function fetchUserProfile(userId: string): Promise<UserDto> {
    const response = await apiClient.get<UserDto>(`/api/users/${userId}`)
    return response.data
}

/**
 * 検索（投稿＋ユーザー）
 */
export type SearchResult = {
    posts: PostDto[]
    users: SimpleUserDto[]
}

export async function searchAll(keyword: string): Promise<SearchResult> {
    const response = await apiClient.get<SearchResult>('/api/search', {
        params: { q: keyword },
    })
    return response.data
}

/**
 * アクティビティ
 */
export async function fetchActivity(): Promise<ActivityItemDto[]> {
    const response = await apiClient.get<ActivityItemDto[]>('/api/activity')
    return response.data
}

// 特定の投稿のコメント一覧
export async function fetchComments(postId: string): Promise<CommentDto[]> {
    const res = await apiClient.get<CommentDto[]>(`/api/posts/${postId}/comments`)
    return res.data
}

// コメント追加
export async function addComment(postId: string, text: string): Promise<CommentDto> {
    const res = await apiClient.post<CommentDto>(`/api/posts/${postId}/comments`, { text })
    return res.data
}

// コメントのいいねトグル
export async function toggleCommentLike(commentId: string): Promise<CommentDto> {
    const res = await apiClient.post<CommentDto>(`/api/comments/${commentId}/like`)
    return res.data
}

// 現在ログイン中ユーザーのプロフィール取得
export async function fetchCurrentProfile(): Promise<ProfileDto> {
    const res = await apiClient.get<ProfileDto>("/api/profile")
    return res.data
}

// ログインユーザーのフォロワー一覧
export async function fetchFollowers(): Promise<FollowUserDto[]> {
    const res = await apiClient.get<FollowUserDto[]>("/api/profile/followers")
    return res.data
}

// ログインユーザーのフォロー中一覧
export async function fetchFollowing(): Promise<FollowUserDto[]> {
    const res = await apiClient.get<FollowUserDto[]>("/api/profile/following")
    return res.data
}

export async function toggleLike(postId: string): Promise<PostDto> {
    const res = await apiClient.post<PostDto>(`/api/posts/${postId}/like`)
    return res.data
}


export async function fetchMyPosts(): Promise<ProfilePostDto[]> {
    const res = await apiClient.get<ProfilePostDto[]>("/api/profile/posts");
    return res.data;
}

// 投稿詳細（detailSections 含む）を取得
export async function fetchPost(postId: string): Promise<PostDto> {
    const res = await apiClient.get<PostDto>(`/api/posts/${postId}`);
    return res.data;
}

// 投稿をシェアするときの候補ユーザー一覧を取得
export async function fetchShareSuggestions(
    postId: string,
    query: string
): Promise<ShareUserDto[]> {
    const res = await apiClient.get<ShareUserDto[]>(
        `/api/posts/${postId}/share/suggestions`,
        {
            params: { q: query }, // 検索キーワード。空文字なら「おすすめ一覧」を返す想定
        }
    );
    return res.data;
}

export async function fetchStories(): Promise<StoryDto[]> {
    const res = await apiClient.get<StoryDto[]>("/api/stories");
    return res.data;
}

export async function fetchStoryById(id: string): Promise<StoryDetailDto> {
    const res = await apiClient.get<StoryDetailDto>(`/api/stories/${id}`);
    return res.data;
}
