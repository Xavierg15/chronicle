import { useState, useEffect } from 'react'
import supabase from './supabase'

export const Entry = ({ session }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [hasPosted, setHasPosted] = useState(false)
  const [todayEntry, setTodayEntry] = useState(null)

  useEffect(() => {
    const checkEntry = async () => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      const { data } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('created_at', today)

      if (data && data.length > 0) {
        setHasPosted(true)
        setTodayEntry(data[0])
      }
    }
    checkEntry()
  }, [session.user.id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const { data: existing } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', session.user.id)
      .gte('created_at', today)

    if (existing && existing.length > 0) {
      alert('You already posted today!')
      return
    }

    const { error } = await supabase.from('entries').insert({
      title,
      content,
      user_id: session.user.id
    })

    if (error) alert(error.message)
    else {
      setHasPosted(true)
      setTodayEntry({ title, content, created_at: new Date() })
      setTitle('')
      setContent('')
    }
  }

  if (hasPosted) return (
    <div>
      <p className="text-muted text-xs tracking-widest uppercase mb-6">
        {new Date(todayEntry.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <h1 className="text-3xl font-bold text-primary mb-4 tracking-wide">{todayEntry.title}</h1>
      <p className="text-primary leading-relaxed text-lg">{todayEntry.content}</p>
    </div>
  )

  return (
    <div>
      <p className="text-muted text-xs tracking-widest uppercase mb-8">
        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent border-b border-border text-primary text-2xl font-bold tracking-wide placeholder-muted focus:outline-none focus:border-accent pb-2"
        />
        <textarea
          placeholder="Write your entry..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
          className="bg-transparent text-primary text-lg leading-relaxed placeholder-muted focus:outline-none resize-none"
        />
        <button
          type="submit"
          className="self-start text-xs tracking-widest uppercase text-accent border border-accent px-6 py-2 hover:bg-accent hover:text-background transition-colors"
        >
          Publish Entry
        </button>
      </form>
    </div>
  )
}