import React, { useState } from 'react'
import { searchAll } from '../../api/instagramApi'
import type { PostDto, SimpleUserDto } from '../../api/types'
import { ImageWithFallback } from '../figma/ImageWithFallback'

type Props = {
    onOpenPost?: (post: PostDto) => void
}

export function Search({ onOpenPost }: Props = {}) {
    const [keyword, setKeyword] = useState('')
    const [users, setUsers] = useState<SimpleUserDto[]>([])
    const [posts, setPosts] = useState<PostDto[]>([])
    const [loading, setLoading] = useState(false)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!keyword.trim()) return

        setLoading(true)
        try {
            const result = await searchAll(keyword.trim())
            setUsers(result.users)
            setPosts(result.posts)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="screen screen-search">
            <form onSubmit={handleSearch} className="search-form">
                <input
                    className="search-input"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="検索ワードを入力"
                />
                <button type="submit" className="search-button">
                    検索
                </button>
            </form>

            {loading && <div>検索中...</div>}

            {!loading && (
                <>
                    <section className="search-section">
                        <h2>ユーザー</h2>
                        {users.map((u) => (
                            <div key={u.id} className="search-user">
                                <ImageWithFallback
                                    src={u.avatarUrl}
                                    alt={u.userName}
                                    className="avatar"
                                />
                                <div>
                                    <div>{u.displayName}</div>
                                    <div className="text-gray-400">@{u.userName}</div>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="search-section">
                        <h2>投稿</h2>
                        <div className="search-post-grid">
                            {posts.map((p) => (
                                <button
                                    key={p.id}
                                    className="search-post-thumb"
                                    onClick={() => onOpenPost?.(p)}
                                >
                                    <ImageWithFallback
                                        src={p.imageUrl}
                                        alt={p.caption}
                                        className="post-image"
                                    />
                                </button>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    )
}
