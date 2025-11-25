import { ImageWithFallback } from "../figma/ImageWithFallback";

interface StoryProps {
    username: string;
    avatar: string;
    isViewed?: boolean;
}

export function Story({ username, avatar, isViewed = false }: StoryProps) {
    return (
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <div
                className={`relative p-[2px] rounded-full ${isViewed
                        ? "bg-gray-300"
                        : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
                    }`}
            >
                <div className="bg-white p-[2px] rounded-full">
                    <ImageWithFallback
                        src={avatar}
                        alt={username}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                </div>
            </div>
            <span className="text-xs max-w-[70px] truncate">{username}</span>
        </div>
    );
}
