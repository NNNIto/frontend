
import { useEffect, useState } from "react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { fetchStories } from "../../api/instagramApi";
import type { StoryDto } from "../../api/types";

interface StoriesProps {
    
    onStoryClick: (username: string, avatar: string, image: string) => void;
}

export function Stories({ onStoryClick }: StoriesProps) {
    const [stories, setStories] = useState<StoryDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchStories();
                setStories(data);
            } catch (e) {
                console.error(e);
                setError("ストーリーの取得に失敗しました");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return (
        <div className="flex gap-3 p-3 overflow-x-auto border-b border-gray-200 scrollbar-hide">
            {loading && <span className="text-xs text-gray-500">読み込み中...</span>}
            {error && <span className="text-xs text-red-500">{error}</span>}
            {!loading &&
                !error &&
                stories.map((story) => (
                    <button
                        key={story.id}
                        onClick={() =>
                            onStoryClick(story.userName, story.avatarUrl, story.imageUrl)
                        }
                        className="flex flex-col items-center gap-1 flex-shrink-0"
                    >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5">
                            <div className="w-full h-full rounded-full bg-white p-0.5">
                                <ImageWithFallback
                                    src={story.avatarUrl}
                                    alt={story.userName}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                        <span className="text-xs">{story.userName}</span>
                    </button>
                ))}
        </div>
    );
}
