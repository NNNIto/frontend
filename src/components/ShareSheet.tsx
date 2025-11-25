import {
    X,
    Search,
    Mail,
    MessageCircle,
    Link2,
    Copy,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useEffect, useState } from "react";
import { fetchShareSuggestions } from "../../api/instagramApi";
import type { ShareUserDto } from "../../api/types";

interface ShareSheetProps {
    postId: string;    // どの投稿をシェアするか
    shareUrl: string;  // コピーするための URL
    onClose: () => void;
}

export function ShareSheet({ postId, shareUrl, onClose }: ShareSheetProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<ShareUserDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        alert("リンクをコピーしました");
    };

    // 検索キーワード or postId が変わるたびに候補ユーザーを取得
    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const result = await fetchShareSuggestions(postId, searchQuery);
                setUsers(result);
            } catch (e) {
                console.error(e);
                setError("候補ユーザーの取得に失敗しました");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [postId, searchQuery]);

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md mx-auto rounded-t-3xl max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="font-semibold">共有</h3>
                    <button onClick={onClose} className="p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search */}
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

                {/* Share Options */}
                <div className="p-4 border-b border-gray-200">
                    <div className="grid grid-cols-4 gap-4">
                        <button className="flex flex-col items-center gap-2">
                            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs">メール</span>
                        </button>
                        <button className="flex flex-col items-center gap-2">
                            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                                <MessageCircle className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs">メッセージ</span>
                        </button>
                        <button className="flex flex-col items-center gap-2">
                            <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center">
                                <Link2 className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs">リンク</span>
                        </button>
                        <button
                            onClick={handleCopyLink}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="w-14 h-14 bg-gray-500 rounded-full flex items-center justify-center">
                                <Copy className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs">コピー</span>
                        </button>
                    </div>
                </div>

                {/* Suggested Users */}
                <div className="flex-1 overflow-y-auto p-4">
                    <h4 className="text-sm font-semibold mb-3">おすすめ</h4>

                    {loading && (
                        <div className="text-sm text-gray-500">読み込み中...</div>
                    )}

                    {error && (
                        <div className="text-sm text-red-500 mb-2">{error}</div>
                    )}

                    {!loading && !error && (
                        <div className="space-y-3">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
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
                                    <button className="px-4 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-semibold">
                                        送信
                                    </button>
                                </div>
                            ))}

                            {users.length === 0 && (
                                <div className="text-sm text-gray-500">
                                    ユーザーが見つかりません
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
