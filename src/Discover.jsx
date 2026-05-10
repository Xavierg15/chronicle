import { useState, useEffect } from 'react'
import supabase from './supabase'

export const Discover = ({ session }) => {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [following, setFollowing] = useState([])

  useEffect(() => {
    const fetchFollowing = async () => {
      const { data, error } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', session.user.id)

      if (error) alert(error.message)
      else setFollowing(data.map(f => f.following_id))
    }

    fetchFollowing()
  }, [session.user.id])

  const handleSearch = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', `%${search}%`)
      .neq('id', session.user.id)

    if (error) alert(error.message)
    else setResults(data)
  }

  const handleFollow = async (userId) => {
    const { error } = await supabase.from('follows').insert({
      follower_id: session.user.id,
      following_id: userId
    })
    if (error) alert(error.message)
    else setFollowing([...following, userId])
  }

  const handleUnfollow = async (userId) => {
    await supabase.from('follows').delete()
      .eq('follower_id', session.user.id)
      .eq('following_id', userId)
    setFollowing(following.filter(id => id !== userId))
  }

  return (
    <div>
      <h1 className="text-xs tracking-widest uppercase text-muted mb-8">Discover</h1>
  
      <div className="flex gap-4 mb-10">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-b border-border text-primary placeholder-muted focus:outline-none focus:border-accent pb-2 flex-1 tracking-wide"
        />
        <button
          onClick={handleSearch}
          className="text-xs tracking-widest uppercase text-accent border border-accent px-6 py-2 hover:bg-accent hover:text-background transition-colors"
        >
          Search
        </button>
      </div>
  
      <div className="flex flex-col">
        {results.map((user) => (
          <div key={user.id} className="flex items-center justify-between py-4 border-b border-border">
            <span className="text-primary tracking-wide">{user.username}</span>
            {following.includes(user.id) ? (
              <button
                onClick={() => handleUnfollow(user.id)}
                className="text-xs tracking-widest uppercase text-muted border border-border px-4 py-1 hover:text-primary hover:border-primary transition-colors"
              >
                Following
              </button>
            ) : (
              <button
                onClick={() => handleFollow(user.id)}
                className="text-xs tracking-widest uppercase text-accent border border-accent px-4 py-1 hover:bg-accent hover:text-background transition-colors"
              >
                Follow
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}