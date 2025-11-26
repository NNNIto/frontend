import { useEffect, useState } from "react";
import { fetchActivity } from "../api/instagramApi";
import type { ActivityItemDto } from "../api/types";
import { ImageWithFallback } from "./figma/ImageWithFallback";

function activityText(a: ActivityItemDto) {
  switch (a.type) {
    case "Like":
      return "があなたの投稿にいいねしました";
    case "Follow":
      return "があなたをフォローしました";
    case "Comment":
      return "があなたの投稿にコメントしました";
    default:
      return `がアクションしました (${a.type})`;
  }
}

export function Activity() {
  const [items, setItems] = useState<ActivityItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchActivity(1, 30);
        setItems(data);
      } catch (e) {
        console.error(e);
        setError("アクティビティ取得に失敗しました");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="screen">読み込み中...</div>;
  if (error) return <div className="screen text-red-500">{error}</div>;

  return (
    <div className="screen pb-20">
      <h2 className="text-lg font-semibold px-4 py-3">アクティビティ</h2>
      <div className="flex flex-col">
        {items.map((a) => (
          <div key={a.id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <ImageWithFallback
              src={a.fromUserAvatarUrl}
              alt={a.fromUserName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-sm">
              <span className="font-semibold">{a.fromUserName}</span>
              <span>{activityText(a)}</span>
              <div className="text-xs text-gray-400">
                {new Date(a.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-gray-500 px-4 py-8">まだアクティビティはありません</div>
        )}
      </div>
    </div>
  );
}
