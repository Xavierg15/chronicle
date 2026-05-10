import supabase from './supabase'

export const Nav = ({ activeTab, setActiveTab, session }) => {
  if (!session) return null

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-border">
      <span className="text-accent font-bold tracking-widest uppercase text-sm"></span>

      <div className="flex gap-6">
        <button
          onClick={() => setActiveTab('entry')}
          className={`text-sm tracking-wider uppercase ${activeTab === 'entry' ? 'text-primary' : 'text-muted hover:text-primary'}`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`text-sm tracking-wider uppercase ${activeTab === 'journal' ? 'text-primary' : 'text-muted hover:text-primary'}`}
        >
          Journal
        </button>
        <button
          onClick={() => setActiveTab('feed')}
          className={`text-sm tracking-wider uppercase ${activeTab === 'feed' ? 'text-primary' : 'text-muted hover:text-primary'}`}
        >
          Feed
        </button>
        <button
          onClick={() => setActiveTab('discover')}
          className={`text-sm tracking-wider uppercase ${activeTab === 'discover' ? 'text-primary' : 'text-muted hover:text-primary'}`}
        >
          Discover
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`text-sm tracking-wider uppercase ${activeTab === 'profile' ? 'text-primary' : 'text-muted hover:text-primary'}`}
        >
          Profile
        </button>
      </div>

      <button
        onClick={() => { supabase.auth.signOut(); setActiveTab('entry') }}
        className="text-sm text-muted hover:text-primary tracking-wider uppercase"
      >
        Sign Out
      </button>
    </nav>
  )
}