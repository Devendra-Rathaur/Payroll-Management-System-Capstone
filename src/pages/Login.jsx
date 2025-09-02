import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await login({ username, password })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed')
    }
  }

  return (
    <div className="container d-flex vh-100">
      <div className="row align-self-center w-100">
        <div className="col-md-4 offset-md-4">
          <div className="card p-4 shadow">
            <h4 className="mb-3">Payroll System — Login</h4>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input className="form-control" value={username} onChange={e=>setUsername(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} required />
              </div>
              <button className="btn btn-primary w-100" type="submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
