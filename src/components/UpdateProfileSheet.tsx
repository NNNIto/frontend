import { Filter } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useMemo, useState } from "react";
import { FollowSheet } from "./FollowSheet";
import { EditProfileSheet } from "./EditProfileSheet";
import { fetchCurrentProfile, fetchMyPosts } from "../api/instagramApi";
import type { ProfileDto, ProfilePostDto } from "../api/types";

export function Profile() {
    const [selectedGenre, setSelectedGenre] = useState("すべて");
    const [showFollowSheet, setShowFollowSheet] = useState<"followers" | "following" | null>(null);
    const [showEditProfile, setShowEditProfile] = useState(false);

    const [profile, setProfile] = useState<ProfileDto | null>(null);
    const [posts, setPosts] = useState<ProfilePostDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // プロフィール & 自分の投稿を読み込み
    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);

                const [profileRes, postsRes] = await Promise.all([
                    fetchCurrentProfile(),
                    fetchMyPosts(),
                ]);

                setProfile(profileRes);
                setPosts(postsRes);
            } catch (e) {
                console.error(e);
                setError("プロフィール情報の取得に失敗しました");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    // ジャンル一覧（API の結果から動的生成）
    const genres = useMemo(() => {
        const set = new Set<string>();
        posts.forEach((p) => set.add(p.genre));
        return ["すべて", ...Array.from(set)];
    }, [posts]);

    // ジャンルでフィルタ
    const filteredPosts = useMemo(() => {
        if (selectedGenre === "すべて") return posts;
        return posts.filter((post) => post.genre === selectedGenre);
    }, [posts, selectedGenre]);

    return (
        <div className="pb-16">
            {/* Profile Header */}
            <div className="px-4 py-3">
                {error && (
                    <div className="mb-2 text-sm text-red-500">{error}</div>
                )}

                <div className="flex items-center justify-between mb-4">
                    <ImageWithFallback
                        src={profile?.avatarUrl ?? "https://images.unsplash.com/photo-1602273660127-a0000560a4c1?w=400"}
                        alt={profile?.name ?? "Profile"}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex gap-8">
                        <button onClick={() => setShowFollowSheet(null)} className="text-center">
                            <div className="font-semibold">
                                {profile?.postsCount?.toLocaleString() ?? "-"}
                            </div>
                            <div className="text-sm text-gray-600">投稿</div>
                        </button>
                        <button
                            onClick={() => setShowFollowSheet("followers")}
                            className="text-center"
                        >
                            <div className="font-semibold">
                                {profile?.followersCount?.toLocaleString() ?? "-"}
                            </div>
                            <div className="text-sm text-gray-600">フォロワー</div>
                        </button>
                        <button
                            onClick={() => setShowFollowSheet("following")}
                            className="text-center"
                        >
                            <div className="font-semibold">
                                {profile?.followingCount?.toLocaleString() ?? "-"}
                            </div>
                            <div className="text-sm text-gray-600">フォロー中</div>
                        </button>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="font-semibold">
                        {profile?.name ?? "あなたの名前"}
                    </div>
                    <div className="text-sm text-gray-600 whitespace-pre-line">
                        {profile?.bio ??
                            `フードブロガー 🍜 | グルメ探検家 🍴
美味しいものを求めて日本全国を旅しています`}
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {profile?.tags?.length
                        ? profile.tags.map((tag) => (
                            <div
                                key={tag}
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                            >
                                {tag}
                            </div>
                        ))
                        : (
                            <>
                                <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-full text-sm font-semibold">
                                    銀座
                                </div>
                                <div className="px-3 py-1 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 rounded-full text-sm font-semibold">
                                    ハワイ
                                </div>
                                <div className="px-3 py-1 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-700 rounded-full text-sm font-semibold">
                                    ラーメン
                                </div>
                                <div className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                                    カフェ
                                </div>
                            </>
                        )}
                </div>

                <div className="flex gap-2">
                    <button
                        className="flex-1 py-2 bg-gray-200 rounded-lg font-semibold"
                        onClick={() => setShowEditProfile(true)}
                    >
                        プロフィールを編集
                    </button>
                </div>
            </div>

            {/* Genre Filter */}
            <div className="px-4 py-3 border-t border-b border-gray-200">
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

            {/* Posts Grid */}
            {loading ? (
                <div className="px-4 py-12 text-center text-gray-500">
                    読み込み中...
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-3 gap-[2px]">
                        {filteredPosts.map((post) => (
                            <div key={post.id} className="aspect-square">
                                <ImageWithFallback
                                    src={post.imageUrl}
                                    alt={post.genre}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* No Results */}
                    {filteredPosts.length === 0 && (
                        <div className="px-4 py-12 text-center text-gray-500">
                            条件に一致する投稿がありません
                        </div>
                    )}
                </>
            )}

            {/* Follow Sheet */}
            {showFollowSheet && (
                <FollowSheet
                    type={showFollowSheet}
                    onClose={() => setShowFollowSheet(null)}
                />
            )}

            {/* Edit Profile Sheet */}
            {showEditProfile && (
                <EditProfileSheet onClose={() => setShowEditProfile(false)} />
            )}
        </div>
    );
}
