import { useState, useEffect } from 'react'
import supabase from './supabase'

export const Profile = ({ session }) => {
  const [profile, setProfile] = useState(null)
  const [username, setUsername] = useState('')
  const [editing, setEditing] = useState(false)
  const [streak, setStreak] = useState(0)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])

  const calculateStreak = (entries) => {
    let streak = 0
    let currentDate = new Date()

    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].created_at).toLocaleDateString()
      const checkDate = currentDate.toLocaleDateString()

      if (entryDate === checkDate) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }
  
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)

      if (error) alert(error.message)
      else {
        setProfile(data[0])
        setUsername(data[0].username)
      }
    }

    const fetchStreak = async () => {
      const { data: entries } = await supabase
        .from('entries')
        .select('created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      setStreak(calculateStreak(entries || []))
    }
    
    const fetchFollowing = async () => {
      const { data } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', session.user.id)
    
      console.log('follows data:', data)
    
      const withUsernames = await Promise.all(
        (data || []).map(async (f) => {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', f.following_id)
            .single()
    
          console.log('profile fetch:', f.following_id, profile, error)
    
          return { ...f, username: profile?.username || 'Anonymous' }
        })
      )
      setFollowing(withUsernames)
    }
    
    const fetchFollowers = async () => {
      const { data } = await supabase
        .from('follows')
        .select('follower_id')
        .eq('following_id', session.user.id)
    
      const withUsernames = await Promise.all(
        (data || []).map(async (f) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', f.follower_id)
            .single()
          return { f,username: profile?.username || 'Anonymous' }
        })
      )
      setFollowers(withUsernames)
    }
    
    fetchProfile()
    fetchStreak()
    fetchFollowers()
    fetchFollowing()
  }, [session.user.id])

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', session.user.id)

    if (error) alert(error.message)
    else {
      setProfile({ ...profile, username })
      setEditing(false)
    }
  }

  if (!profile) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-xs tracking-widest uppercase text-muted mb-8">Profile</h1>

      <div className="flex flex-col gap-6">
        <div className="border-b border-border pb-6">
          <p className="text-muted text-xs tracking-widest uppercase mb-2">Email</p>
          <p className="text-primary">{session.user.email}</p>
        </div>

        <div className="border-b border-border pb-6">
          <p className="text-muted text-xs tracking-widest uppercase mb-2">Username</p>
          {editing ? (
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent border-b border-border text-primary focus:outline-none focus:border-accent pb-2 tracking-wide"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleUpdate}
                  className="text-xs tracking-widest uppercase text-accent border border-accent px-6 py-2 hover:bg-accent hover:text-background transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="text-xs tracking-widest uppercase text-muted border border-border px-6 py-2 hover:text-primary hover:border-primary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-primary">{profile.username}</p>
              <button
                onClick={() => setEditing(true)}
                className="text-xs tracking-widest uppercase text-muted hover:text-primary"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <div className="border-b border-border pb-6">
          <p className="text-muted text-xs tracking-widest uppercase mb-2">Streak</p>
          <p className="text-primary text-2xl font-bold">{streak} <span className="text-muted text-sm">days</span></p>
        </div>

        <div className="border-b border-border pb-6">
          <p className="text-muted text-xs tracking-widest uppercase mb-4">Following</p>
          {following.length === 0 ? (
            <p className="text-muted text-sm">Not following anyone yet.</p>
          ) : (
            following.map((f) => (
              <p key={f.following_id} className="text-primary tracking-wide py-2 border-b border-border">
                {f.username}
              </p>
            ))
          )}
        </div>

        <div className="border-b border-border pb-6">
          <p className="text-muted text-xs tracking-widest uppercase mb-4">Followers</p>
          {followers.length === 0 ? (
            <p className="text-muted text-sm">No followers yet.</p>
          ) : (
            followers.map((f) => (
              <p key={f.follower_id} className="text-primary tracking-wide py-2 border-b border-border">
                {f.username}
              </p>
            ))
          )}
        </div>

        <div className="pt-6">
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-xs tracking-widest uppercase text-muted border border-border px-6 py-2 hover:text-primary hover:border-primary transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}