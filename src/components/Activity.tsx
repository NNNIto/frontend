import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchActivity } from "../api/instagramApi";
import type { ActivityItemDto, PostDto } from "../api/types";

const genres = ["すべて", "ラーメン", "和食", "イタリアン", "スイーツ", "カフェ"];
const locations = ["すべて", "渋谷", "銀座", "六本木", "新宿", "表参道"];

export function Activity() {
    const [selectedGenre, setSelectedGenre] = useState("すべて");
    const [selectedLocation, setSelectedLocation] = useState("すべて");

    const [likedPosts, setLikedPosts] = useState<PostDto[]>([]);
    const [loading, setLoading] = useState(true);

    // 🔥 API 呼び出し
    useEffect(() => {
        async function load() {
            try {
                setLoading(true);

                const activities = await fetchActivity();

                // いいね（Like）だけ抽出
                const liked = activities
                    .filter((a) => a.type === "Like" && a.targetPost)
                    .map((a) => a.targetPost!) // targetPost が null じゃない前提で抜く
                    .map((p) => ({
                        ...p,
                        genre: extractGenreFromCaption(p.caption), // 必要なら整形
                        location: extractLocationFromCaption(p.caption), // 必要なら整形
                    }));

                setLikedPosts(liked);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    // 👇必要に応じて caption からジャンルや場所を抽出する関数を自作する例
    function extractGenreFromCaption(caption: string): string {
        const found = genres.find((g) => caption.includes(g));
        return found ?? "その他";
    }

    function extractLocationFromCaption(caption: string): string {
        const found = locations.find((l) => caption.includes(l));
        return found ?? "不明";
    }

    // 🔍 フィルタ処理
    const filteredPosts = likedPosts.filter((post) => {
        const genreMatch = selectedGenre === "すべて" || post.genre === selectedGenre;
        const locationMatch =
            selectedLocation === "すべて" || post.location === selectedLocation;
        return genreMatch && locationMatch;
    });

    if (loading) {
        return <div className="p-4">読み込み中...</div>;
    }

    return (
        <div className="pb-16">
            {/* Header */}
            <div className="px-4 py-4 border-b border-gray-200">
                <h2 className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 fill-red-500 stroke-red-500" />
                    いいねした投稿
                </h2>

                {/* Filters */}
                <div className="space-y-3">
                    {/* Genre Filter */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Filter className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">ジャンル</span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {genres.map((genre) => (
                                <button
                                    key={genre}
                                    onClick={() => setSelectedGenre(genre)}
                                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${selectedGenre === genre
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Location Filter */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Filter className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600">場所</span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {locations.map((location) => (
                                <button
                                    key={location}
                                    onClick={() => setSelectedLocation(location)}
                                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${selectedLocation === location
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >
                                    {location}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Liked Posts Grid */}
            <div className="grid grid-cols-3 gap-[2px]">
                {filteredPosts.map((post) => (
                    <div key={post.id} className="aspect-square relative group">
                        <ImageWithFallback
                            src={post.imageUrl}
                            alt={post.userName}
                            className="w-full h-full object-cover"
                        />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="text-white text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Heart className="w-4 h-4 fill-white" />
                                </div>
                                <p className="text-xs">{post.userName}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No Results */}
            {filteredPosts.length === 0 && (
                <div className="px-4 py-12 text-center text-gray-500">
                    条件に一致する投稿がありません
                </div>
            )}
        </div>
    );
}
