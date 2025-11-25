// src/api/types.ts

export type SimpleUserDto = {
    id: string
    userName: string
    displayName: string
    avatarUrl: string
    bio?: string | null
}

export type UserDto = {
    id: string
    userName: string
    displayName: string
    avatarUrl: string
    bio?: string | null
    posts: PostDto[]
}

// ActivityItem はシンプルにそのまま受け取る想定
export type ActivityType = 'Like' | 'Follow' | 'Comment' | number

export type ActivityItemDto = {
    id: string
    type: ActivityType
    fromUser: SimpleUserDto
    targetPost?: PostDto | null
    message: string
    createdAt: string
}

// コメント DTO
export type CommentDto = {
    id: string
    username: string
    avatarUrl: string
    text: string
    likes: number
    timeAgo: string
    likedByCurrentUser: boolean
}

export type FollowUserDto = {
    id: string
    userName: string
    displayName: string
    avatarUrl: string
}

// プロフィール
export type ProfileDto = {
    name: string;
    userName: string;
    avatarUrl: string;
    bio: string;
    tags: string[];
    postsCount: number;
    followersCount: number;
    followingCount: number;
};

// プロフィール画面のグリッド用投稿
export type ProfilePostDto = {
    id: string;
    imageUrl: string;
    genre: string;
};

// 1件のレビュー
export type ReviewDto = {
    user: string;
    avatar: string;
    text: string;
    rating: number;
};

// Post 詳細セクション
export type PostDetailSectionDto =
    | {
        type: "photos";
        title: string;
        images: string[];
    }
    | {
        type: "rating_with_reviews";
        title: string;
        rating: number;
        reviews: ReviewDto[];
    }
    | {
        type: "menu";
        title: string;
        image: string;
    }
    | {
        type: "map";
        title: string;
        location: string;
    };

// PostDto（Home / Activity / Search など共通）
export type PostDto = {
    id: string;
    /** ユーザー名（@xxx） */
    userName: string;              // ← username → userName に統一
    /** アイコン画像 */
    avatarUrl: string;
    /** メイン画像 */
    imageUrl: string;
    caption: string;
    likeCount: number;
    likedByCurrentUser: boolean;

    // レストラン情報系
    restaurantName?: string;
    rating?: number;
    isBest100?: boolean;
    location?: string;

    // 一覧・アクティビティ用の追加情報
    genre?: string;
    createdAtText?: string;        // "2時間前" などを表示したいとき用
    commentCount?: number;         // Home で表示しているコメント数

    // 詳細ビュー用
    detailSections?: PostDetailSectionDto[];
};

// シェア先候補ユーザー
export type ShareUserDto = {
    id: string;
    userName: string;
    displayName: string;
    avatarUrl: string;
};

// ストーリー一覧用
export type StoryDto = {
    id: string;
    userName: string;
    avatarUrl: string;
    imageUrl: string;
    /** 既読フラグ（UI 用なので任意） */
    seen?: boolean;
};

// ストーリー詳細ビュー用
export type StoryDetailDto = {
    id: string;
    userName: string;
    avatarUrl: string;
    imageUrl: string;
    createdAt: string; // "2時間前" の元データ
};
