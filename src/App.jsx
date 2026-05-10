import { useState, useEffect } from 'react'
import supabase from './supabase'
import { Auth } from './Auth'
import { Entry } from './Entry'
import { Journal } from './Journal'
import { Feed } from './Feed'
import { Profile } from './Profile'
import { Discover } from './Discover'
import { Nav } from './Nav'
function App() {
  const [session, setSession] = useState(null)
  const [activeTab, setActiveTab] = useState('entry')
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    // inside return:
<div className="min-h-screen bg-background font-mono text-primary">
  <Nav activeTab={activeTab} setActiveTab={setActiveTab} session={session} />
  
  {session ? (
    <>
    <main className ="max-w-2xl mx-auto px-6 py-10">
      {activeTab === 'entry' && <Entry session={session} />}
      {activeTab === 'journal' && <Journal session={session} />}
      {activeTab === 'feed' && <Feed session={session} />}
      {activeTab === 'discover' && <Discover session={session} />}
      {activeTab === 'profile' && <Profile session={session} />}
    </main>
    </>
  ) : (
    <Auth />
  )}
</div>
  )
}
export default App