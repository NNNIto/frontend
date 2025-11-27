import { X, Search } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useMemo, useState } from "react";
import { fetchFollowers, fetchFollowing } from "../api/instagramApi";
import type { FollowUserDto } from "../api/types";

interface FollowSheetProps {
    type: "followers" | "following";
    onClose: () => void;
}

export function FollowSheet({ type, onClose }: FollowSheetProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<FollowUserDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    
    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);

                const data =
                    type === "followers" ? await fetchFollowers() : await fetchFollowing();

                setUsers(data);
            } catch (e) {
                console.error(e);
                setError("ユーザー一覧の取得に失敗しました");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [type]);

    
    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;

        const q = searchQuery.trim().toLowerCase();
        return users.filter(
            (u) =>
                u.userName.toLowerCase().includes(q) ||
                u.displayName.toLowerCase().includes(q)
        );
    }, [users, searchQuery]);

    const title = type === "followers" ? "フォロワー" : "フォロー中";

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md mx-auto rounded-t-3xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="font-semibold">{title}</h3>
                    <button onClick={onClose} className="p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <Search className="w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="検索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent outline-none flex-1"
                        />
                    </div>
                </div>

                {}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading && (
                        <div className="text-center text-gray-500">読み込み中...</div>
                    )}
                    {error && !loading && (
                        <div className="text-center text-red-500">{error}</div>
                    )}

                    {!loading && !error && filteredUsers.length === 0 && (
                        <div className="text-center text-gray-500">
                            ユーザーが見つかりませんでした
                        </div>
                    )}

                    {!loading && !error && filteredUsers.length > 0 && (
                        <div className="space-y-3">
                            {filteredUsers.map((user) => (
                                <div key={user.id} className="flex items-center gap-3">
                                    <ImageWithFallback
                                        src={user.avatarUrl}
                                        alt={user.userName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <div className="font-semibold">{user.userName}</div>
                                        <div className="text-sm text-gray-600">
                                            {user.displayName}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
