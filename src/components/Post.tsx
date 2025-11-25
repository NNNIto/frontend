import { Heart, MessageCircle, Send, Star, MapPin, Award } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useRef } from "react";
import { toggleLike, fetchPost } from "../api/instagramApi";
import type { PostDto, PostDetailSectionDto } from "../api/types";

interface PostProps {
    id: string;
    username: string;
    avatar: string;
    image: string;
    likes: number;
    caption: string;
    timeAgo: string;
    restaurantName?: string;
    rating?: number;
    isBest100?: boolean;
    location?: string;
    likedByCurrentUser?: boolean;
    onOpenComments: () => void;
    onOpenShare: () => void;
}

export function Post({
    id,
    username,
    avatar,
    image,
    likes,
    caption,
    timeAgo,
    restaurantName = "美味しいレストラン",
    rating = 4.5,
    isBest100 = false,
    location = "東京都渋谷区",
    likedByCurrentUser = false,
    onOpenComments,
    onOpenShare,
}: PostProps) {
    const [isLiked, setIsLiked] = useState(likedByCurrentUser);
    const [likeCount, setLikeCount] = useState(likes);
    const [showDetails, setShowDetails] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [detailSections, setDetailSections] = useState<PostDetailSectionDto[]>([]);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    const handleLike = async () => {
        try {
            const updated: PostDto = await toggleLike(id);
            const nextLiked = updated.likedByCurrentUser;
            setIsLiked(nextLiked);
            setLikeCount(updated.likeCount);

            if (nextLiked) {
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 600);
            }
        } catch (e) {
            console.error("いいね更新に失敗しました", e);
        }
    };

    const handleToggleDetails = async () => {
        // 開くときにだけ API 呼び出し（閉じる → 開く → 2回目はキャッシュ利用）
        const willOpen = !showDetails;
        setShowDetails(willOpen);

        if (willOpen && detailSections.length === 0) {
            try {
                setDetailsLoading(true);
                setDetailsError(null);

                const result = await fetchPost(id);
                setDetailSections(result.detailSections ?? []);
            } catch (e) {
                console.error(e);
                setDetailsError("詳細情報の取得に失敗しました");
            } finally {
                setDetailsLoading(false);
            }
        }
    };

    return (
        <div className="mb-4">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-3">
                    <ImageWithFallback
                        src={avatar}
                        alt={username}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                        <div className="font-semibold">{username}</div>
                        <div className="text-xs text-gray-600">{restaurantName}</div>
                    </div>
                </div>
            </div>

            {/* Image */}
            <ImageWithFallback
                src={image}
                alt="Post"
                className="w-full aspect-square object-cover"
            />

            {/* Best 100 Badge */}
            {isBest100 && (
                <div className="px-3 py-2">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 rounded-full">
                        <Award className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-orange-600 font-semibold">
                            百名店
                        </span>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-4">
                    <button onClick={handleLike} className="p-1 relative">
                        <Heart
                            className={`w-6 h-6 transition-transform ${isAnimating ? "animate-ping scale-150" : ""
                                } ${isLiked ? "fill-red-500 stroke-red-500" : ""}`}
                        />
                    </button>
                    <button onClick={onOpenComments} className="p-1">
                        <MessageCircle className="w-6 h-6" />
                    </button>
                    <button onClick={onOpenShare} className="p-1">
                        <Send className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Likes */}
            <div className="px-3 pb-1">
                <span className="font-semibold">
                    {likeCount.toLocaleString()}件のいいね
                </span>
            </div>

            {/* Caption */}
            <div className="px-3 pb-1">
                <span className="font-semibold mr-2">{username}</span>
                <span>{caption}</span>
            </div>

            {/* Details Toggle */}
            <div className="px-3 pb-2">
                <button
                    onClick={handleToggleDetails}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    {showDetails ? "詳細を非表示" : "詳細を表示"}
                </button>
            </div>

            {/* Horizontal Scroll Details */}
            {showDetails && (
                <div
                    ref={scrollRef}
                    className="flex gap-3 px-3 pb-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                >
                    {detailsLoading && (
                        <div className="text-sm text-gray-500">読み込み中...</div>
                    )}
                    {detailsError && (
                        <div className="text-sm text-red-500">{detailsError}</div>
                    )}

                    {!detailsLoading &&
                        !detailsError &&
                        detailSections.map((section, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 w-[280px] bg-gray-50 rounded-lg p-4 snap-start"
                            >
                                <h4 className="font-semibold mb-3">{section.title}</h4>

                                {section.type === "photos" && section.images && (
                                    <div className="grid grid-cols-2 gap-2">
                                        {section.images.map((img, i) => (
                                            <ImageWithFallback
                                                key={i}
                                                src={img}
                                                alt={`${section.title} ${i + 1}`}
                                                className="w-full aspect-square object-cover rounded-lg"
                                            />
                                        ))}
                                    </div>
                                )}

                                {section.type === "rating_with_reviews" && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 ${i < Math.floor(section.rating || 0)
                                                                ? "fill-orange-400 stroke-orange-400"
                                                                : "stroke-gray-300"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="font-semibold">
                                                {section.rating?.toFixed(1)}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-600 mb-3">
                                            フォロー中のレビュー
                                        </div>
                                        <div className="space-y-3">
                                            {section.reviews?.map((review, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <ImageWithFallback
                                                        src={review.avatar}
                                                        alt={review.user}
                                                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-semibold text-sm">
                                                                {review.user}
                                                            </span>
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, j) => (
                                                                    <Star
                                                                        key={j}
                                                                        className={`w-3 h-3 ${j < Math.floor(review.rating)
                                                                                ? "fill-orange-400 stroke-orange-400"
                                                                                : "stroke-gray-300"
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-600">
                                                            {review.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {section.type === "menu" && section.image && (
                                    <ImageWithFallback
                                        src={section.image}
                                        alt="Menu"
                                        className="w-full aspect-[3/4] object-cover rounded-lg"
                                    />
                                )}

                                {section.type === "map" && (
                                    <div>
                                        <div className="w-full h-[150px] bg-gray-200 rounded-lg mb-2 flex items-center justify中心">
                                            <MapPin className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-sm text-gray-600">{section.location}</p>
                                        <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                                            地図アプリで開く
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            )}

            {/* Time */}
            <div className="px-3 pb-2">
                <span className="text-gray-500 text-xs">{timeAgo}</span>
            </div>
        </div>
    );
}
