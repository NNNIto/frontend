
import { X, Heart, Send } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { fetchStoryById } from "../../api/instagramApi";
import type { StoryDetailDto } from "../../api/types";

interface StoryViewerProps {
    storyId: string;
    onClose: () => void;
}

export function StoryViewer({ storyId, onClose }: StoryViewerProps) {
    const [progress, setProgress] = useState(0);
    const [story, setStory] = useState<StoryDetailDto | null>(null);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        async function load() {
            try {
                const data = await fetchStoryById(storyId);
                setStory(data);
            } catch (e) {
                console.error("ストーリー取得失敗", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [storyId]);

    
    if (loading || !story) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                <span className="text-white">読み込み中...</span>
            </div>
        );
    }

    
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    onClose();
                    return 100;
                }
                return prev + 2;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            {}
            <div className="absolute top-2 left-0 right-0 px-2">
                <div className="h-0.5 bg-white/30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {}
            <div className="absolute top-6 left-0 right-0 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ImageWithFallback
                        src={story.avatarUrl}
                        alt={story.userName}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white"
                    />
                    <span className="text-white font-semibold">{story.userName}</span>
                    <span className="text-white/70 text-sm">{story.createdAt}</span>
                </div>
                <button onClick={onClose} className="text-white p-1">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {}
            <ImageWithFallback
                src={story.imageUrl}
                alt="Story"
                className="w-full h-full object-contain"
            />

            {}
            <div className="absolute bottom-6 left-0 right-0 px-4">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="メッセージを送信..."
                        className="flex-1 bg-transparent border border-white/50 rounded-full px-4 py-2 text-white placeholder:text-white/70 outline-none"
                    />
                    <button className="text-white">
                        <Heart className="w-6 h-6" />
                    </button>
                    <button className="text-white">
                        <Send className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
