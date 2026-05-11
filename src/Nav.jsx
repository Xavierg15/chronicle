import supabase from './supabase'

export const Nav = ({ activeTab, setActiveTab, session }) => {
  if (!session) return null

  const tabs = [
    { id: 'entry', label: 'Today', icon: '✎' },
    { id: 'journal', label: 'Journal', icon: '▤' },
    { id: 'feed', label: 'Feed', icon: '◈' },
    { id: 'discover', label: 'Discover', icon: '⊕' },
    { id: 'profile', label: 'Profile', icon: '◎' },
  ]

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border">
        <span className="text-accent font-bold tracking-widest uppercase text-sm">Chronicle</span>
        <div className="flex gap-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm tracking-wider uppercase ${activeTab === tab.id ? 'text-primary' : 'text-muted hover:text-primary'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => { supabase.auth.signOut(); setActiveTab('entry') }}
          className="text-sm text-muted hover:text-primary tracking-wider uppercase"
        >
          Sign Out
        </button>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex justify-around items-center py-3 z-50" style={{paddingBottom:'max(12px, env(safe-area-inset-bottom))'}}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 ${activeTab === tab.id ? 'text-primary' : 'text-muted'}`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-xs tracking-widest uppercase">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Mobile bottom padding so content isn't hidden behind nav */}
      <div className="md:hidden h-20" />
    </>
  )
}