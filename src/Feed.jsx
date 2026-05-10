import { useState, useEffect } from 'react'
import supabase from './supabase'

export const Feed = ({ session }) => {
  const [hasPosted, setHasPosted] = useState(false)
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAndFetch = async () => {
      const today = new Date().toISOString().split('T')[0]

      // Step 1: check if current user posted today
      const { data: myEntry } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('created_at', today)

      if (myEntry && myEntry.length > 0) {
        setHasPosted(true)

        // Step 2: fetch who the user follows
        const { data: followData } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', session.user.id)

        const followingIds = followData.map(f => f.following_id)

        if (followingIds.length === 0) {
          setIsLoading(false)
          return
        }

        // Step 3: fetch entries from followed users
        const { data: feedEntries } = await supabase
          .from('entries')
          .select('*')
          .gte('created_at', today)
          .in('user_id', followingIds)

        // Step 4: fetch username for each entry
        const entriesWithUsernames = await Promise.all(
          (feedEntries || []).map(async (entry) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', entry.user_id)
              .single()

            return { ...entry, username: profile?.username || 'Anonymous' }
          })
        )

        setEntries(entriesWithUsernames)
      }

      setIsLoading(false)
    }

    checkAndFetch()
  }, [session.user.id])

  if (isLoading) return <p>Loading...</p>

  if (!hasPosted) return <p>Post your entry first to see the feed.</p>

  if (entries.length === 0) return <p>Follow others to see their entries.</p>

  return (
    <div>
      <h1 className="text-xs tracking-widest uppercase text-muted mb-8">Today's Feed</h1>
  
      <div className="flex flex-col gap-10">
        {entries.map((entry) => (
          <div key={entry.id} className="border-b border-border pb-10">
            <div className="flex items-baseline justify-between mb-4">
              <span className="text-accent text-xs tracking-widest uppercase">{entry.username}</span>
              <span className="text-muted text-xs tracking-widest uppercase">
                {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h2 className="text-xl font-bold text-primary mb-3 tracking-wide">{entry.title}</h2>
            <p className="text-primary leading-relaxed">{entry.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}