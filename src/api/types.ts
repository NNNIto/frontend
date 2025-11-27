


export type SimpleUserDto = {
  id: string;
  userName: string;
  displayName: string;
  avatarUrl: string;
  bio?: string | null;
};

export type FollowUserDto = SimpleUserDto;
export type ShareUserDto = SimpleUserDto;

export type PostDto = {
  id: string;
  userName: string;
  avatarUrl: string;
  imageUrl: string;
  caption: string;
  likeCount: number;
  commentCount: number;
  likedByCurrentUser: boolean;
  createdAtText?: string;
  
  detailSections?: PostDetailSectionDto[];
};

export type StoryDto = {
  id: string;
  userId: string;
  userName: string;
  avatarUrl: string;
  isViewed: boolean;
};

export type CommentDto = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  likedByCurrentUser?: boolean; 
  likeCount?: number;
};

export type ActivityItemDto = {
  id: string;
  type: "Like" | "Follow" | "Comment" | string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatarUrl: string;
  postId?: string | null;
  createdAt: string;
};

export type ProfileHeaderDto = {
  userId: string;
  userName: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
};

export type ProfilePostDto = {
  id: string;
  thumbnailUrl: string;
  likeCount: number;
  commentCount: number;
};

export type UpdateProfileRequestDto = {
  displayName: string;
  bio: string;
  avatarUrl: string;
};


export type PostDetailSectionDto =
  | { type: "rating"; title: string; value: string }
  | { type: "tags"; title: string; tags: string[] }
  | { type: "map"; title: string; location: string };


export type StoryDetailDto = {
  id: string;
  userId: string;
  userName: string;
  avatarUrl: string;
  imageUrl: string;
  isViewed: boolean;
  createdAt: string;
  expiresAt: string;
};
