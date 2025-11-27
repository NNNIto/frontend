import { X, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FormEvent, useEffect, useState } from "react";
import type { CommentDto } from "../api/types";
import { addComment, fetchComments, toggleCommentLike } from "../api/instagramApi";

interface CommentSheetProps {
    postId: string;      
    onClose: () => void;
}

export function CommentSheet({ postId, onClose }: CommentSheetProps) {
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    
    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchComments(postId);
                setComments(data);
            } catch (e) {
                console.error(e);
                setError("コメントの取得に失敗しました");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [postId]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const created = await addComment(postId, newComment.trim());

            
            setComments((prev) => [...prev, created]);
            setNewComment("");
        } catch (e) {
            console.error(e);
            
        }
    };

    const handleToggleLike = async (commentId: string) => {
        try {
            const updated = await toggleCommentLike(commentId);
            setComments((prev) =>
                prev.map((c) => (c.id === commentId ? updated : c))
            );
        } catch (e) {
            console.error(e);
        }
    };

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
                    <h3 className="font-semibold">コメント</h3>
                    <button onClick={onClose} className="p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading && (
                        <div className="text-center text-gray-500">読み込み中...</div>
                    )}
                    {error && !loading && (
                        <div className="text-center text-red-500">{error}</div>
                    )}

                    {!loading && !error && comments.length === 0 && (
                        <div className="text-center text-gray-500">
                            まだコメントはありません
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                                <ImageWithFallback
                                    src={comment.avatarUrl}
                                    alt={comment.username}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="font-semibold text-sm">
                                                {comment.username}
                                            </span>
                                            <p className="text-sm mt-1">{comment.text}</p>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                                <span>{comment.timeAgo}</span>
                                                <span>{comment.likes}件のいいね</span>
                                                <button className="font-semibold">返信</button>
                                            </div>
                                        </div>
                                        <button
                                            className="p-1"
                                            onClick={() => handleToggleLike(comment.id)}
                                        >
                                            <Heart
                                                className={`w-4 h-4 ${comment.likedByCurrentUser
                                                        ? "fill-red-500 stroke-red-500"
                                                        : ""
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {}
                <form
                    className="p-4 border-t border-gray-200"
                    onSubmit={handleSubmit}
                >
                    <div className="flex items-center gap-3">
                        <ImageWithFallback
                            src="https:
                            alt="Your avatar"
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <input
                            type="text"
                            placeholder="コメントを追加..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="flex-1 outline-none"
                        />
                        <button
                            type="submit"
                            className={`font-semibold ${newComment ? "text-blue-500" : "text-blue-300"
                                }`}
                            disabled={!newComment}
                        >
                            投稿
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
