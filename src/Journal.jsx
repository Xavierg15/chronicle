import { useState, useEffect } from 'react'
import supabase from './supabase'

export const Journal = ({ session }) => {
  const [entries, setEntries] = useState([])
  const [selectedEntry, setSelectedEntry] = useState(null)

  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) alert(error.message)
      else setEntries(data)
    }

    fetchEntries()
  }, [session.user.id])

  // Detail view
  if (selectedEntry) return (
    <div>
      <button
        onClick={() => setSelectedEntry(null)}
        className="text-muted text-xs tracking-widest uppercase mb-8 hover:text-primary"
      >
        ← Back
      </button>
      <p className="text-muted text-xs tracking-widest uppercase mb-6">
        {new Date(selectedEntry.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <h1 className="text-3xl font-bold text-primary mb-6 tracking-wide">{selectedEntry.title}</h1>
      <p className="text-primary leading-relaxed text-lg">{selectedEntry.content}</p>
    </div>
  )

  // List view
  return (
    <div>
      <h1 className="text-xs tracking-widest uppercase text-muted mb-8">My Journal</h1>

      {entries.length === 0 && (
        <p className="text-muted">No entries yet. Start writing.</p>
      )}

      <div className="flex flex-col">
        {entries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className="flex items-baseline justify-between py-4 border-b border-border hover:text-accent text-left group"
          >
            <span className="text-primary group-hover:text-accent font-bold tracking-wide">
              {entry.title}
            </span>
            <span className="text-muted text-xs tracking-widest uppercase ml-4 shrink-0">
              {new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}