import { useState } from 'react'
import { btnMotion } from './buttonMotion'
import supabase from './supabase'

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async () => {
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
    } else {
      const trimmed = username.trim()
      if (!trimmed) {
        alert('Please choose a username.')
        return
      }
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) alert(error.message)
      else if (!data.user) {
        alert('Check your email to confirm your account, then sign in.')
      } else {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          username: trimmed,
        })
        if (profileError) alert(profileError.message)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-xs tracking-widest uppercase text-accent mb-12">chronicle</h1>
  
      <div className="w-full max-w-sm flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-primary tracking-wide">
          {isLogin ? 'Welcome back.' : 'Start your journey.'}
        </h2>
  
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-transparent border-b border-border text-primary placeholder-muted focus:outline-none focus:border-accent pb-2 tracking-wide"
          />
        )}
  
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-transparent border-b border-border text-primary placeholder-muted focus:outline-none focus:border-accent pb-2 tracking-wide"
        />
  
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-transparent border-b border-border text-primary placeholder-muted focus:outline-none focus:border-accent pb-2 tracking-wide"
        />
  
        <button
          onClick={handleSubmit}
          className={`self-start text-xs tracking-widest uppercase text-accent border border-accent px-6 py-2 hover:bg-accent hover:text-background mt-2 ${btnMotion}`}
        >
          {isLogin ? 'Sign In' : 'Create Account'}
        </button>
  
        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-muted text-xs tracking-wider cursor-pointer hover:text-primary"
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
        </p>
      </div>
    </div>
  )
}