'use client'

import { useState } from 'react'
import { login, signup } from '@/app/(auth)/actions'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    const formData = new FormData(e.currentTarget)
    
    try {
      if (isLogin) {
        await login(formData)
      } else {
        const result = await signup(formData);
        if (result?.message) {
            setMessage(result.message);
        }
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
            <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                />
            </div>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="error-message" style={{ color: 'green' }}>{message}</p>}
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                    {isLogin ? 'Log In' : 'Sign Up'}
                </button>
            </div>
            <div className="switch-auth">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button type="button" onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }}>
                    {isLogin ? 'Sign Up' : 'Log In'}
                </button>
            </div>
        </form>
    </div>
  )
}