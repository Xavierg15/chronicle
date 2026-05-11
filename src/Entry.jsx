import { useState, useEffect } from 'react'
import { btnMotion } from './buttonMotion'
import supabase from './supabase'

export const Entry = ({ session }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(true)
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

  const wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (wordCount > 250) return

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

    const { data, error } = await supabase
      .from('entries')
      .insert({
        title,
        content,
        user_id: session.user.id,
        is_public: isPublic,
      })
      .select()
      .single()

    if (error) alert(error.message)
    else {
      setHasPosted(true)
      setTodayEntry(data)
      setTitle('')
      setContent('')
      setIsPublic(true)
    }
  }

  if (hasPosted) return (
    <div>
      <p className="text-muted text-xs tracking-widest uppercase mb-6">
        {new Date(todayEntry.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      {todayEntry.is_public === false && (
        <p className="text-muted text-xs tracking-widest uppercase mb-4">Private · not on the feed</p>
      )}
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
        <p className={`text-xs tracking-widest ${wordCount > 250 ? 'text-red-400' : 'text-muted'}`}>
          {wordCount} / 250
        </p>
        <button
          type="button"
          onClick={() => setIsPublic((prev) => !prev)}
          aria-pressed={isPublic}
          className="flex max-w-md items-start gap-3 text-left"
        >
          <span
            aria-hidden
            style={{
              background: isPublic ? '#8b7355' : '#1a1814',
              borderColor: isPublic ? '#8b7355' : '#3d3830',
            }}
            className="mt-0.5 inline-block h-[14px] w-[14px] shrink-0 border transition-colors duration-200"
          />
          <span
            className={`text-xs tracking-widest uppercase leading-relaxed transition-colors ${
              isPublic ? 'text-primary' : 'text-muted'
            }`}
          >
            Share on followers&apos; feed after you post
          </span>
        </button>
        <button
          type="submit"
          disabled={wordCount > 250}
          className={`self-start text-xs tracking-widest uppercase border px-6 py-2 ${
            wordCount > 250
              ? 'text-muted border-border cursor-not-allowed'
              : `text-accent border-accent hover:bg-accent hover:text-background ${btnMotion}`
          }`}
        >
          Publish Entry
        </button>
      </form>
    </div>
  )
}