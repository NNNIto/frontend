
import React, { useEffect, useState } from 'react'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import type { PostDto, StoryDto } from '../../api/types'
import { fetchFeed, fetchStories, toggleLike } from '../../api/instagramApi'

type Props = {
    onOpenStory?: (story: StoryDto) => void
    onOpenPost?: (post: PostDto) => void
}

export function Home({ onOpenStory, onOpenPost }: Props = {}) {
    const [stories, setStories] = useState<StoryDto[]>([])
    const [posts, setPosts] = useState<PostDto[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function load() {
            try {
                setLoading(true)
                setError(null)

                const [storiesRes, feedRes] = await Promise.all([
                    fetchStories(),
                    fetchFeed(1, 10),
                ])

                setStories(storiesRes)
                setPosts(feedRes)
            } catch (e) {
                console.error(e)
                setError('データの取得に失敗しました')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    const handleToggleLike = async (postId: string) => {
        try {
            const updated = await toggleLike(postId)
            setPosts((current) =>
                current.map((p) => (p.id === postId ? updated : p)),
            )
        } catch (e) {
            console.error(e)
            
        }
    }

    if (loading) {
        return <div className="screen">読み込み中...</div>
    }

    if (error) {
        return <div className="screen text-red-500">{error}</div>
    }

    return (
        <div className="screen screen-home">
            {}
            <div className="stories-row">
                {stories.map((story) => (
                    <button
                        key={story.id}
                        className={`story-bubble ${story.seen ? 'seen' : ''}`}
                        onClick={() => onOpenStory?.(story)}
                    >
                        <ImageWithFallback
                            src={story.avatarUrl}      
                            alt={story.userName}
                            className="story-avatar"
                        />
                        <span className="story-name">{story.userName}</span>
                    </button>
                ))}
            </div>

            {}
            <div className="feed">
                {posts.map((post) => (
                    <article key={post.id} className="post-card">
                        <header className="post-header">
                            <ImageWithFallback
                                src={post.avatarUrl}   
                                alt={post.userName}
                                className="avatar"
                            />
                            <div className="post-user">
                                <div className="post-username">{post.userName}</div>
                                <div className="post-time">
                                    {post.createdAtText ?? ''} {}
                                </div>
                            </div>
                        </header>

                        <div
                            className="post-image-wrapper"
                            onClick={() => onOpenPost?.(post)}
                        >
                            <ImageWithFallback
                                src={post.imageUrl}
                                alt={post.caption}
                                className="post-image"
                            />
                        </div>

                        <div className="post-actions">
                            <button
                                className="like-button"
                                onClick={() => handleToggleLike(post.id)}
                            >
                                {post.likedByCurrentUser ? '♥' : '♡'} {post.likeCount}
                            </button>
                            <span>💬 {post.commentCount ?? 0}</span>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}
