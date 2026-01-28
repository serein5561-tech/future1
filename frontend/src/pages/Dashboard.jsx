import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Dashboard.css'

export default function Dashboard({ user }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProfile(response.data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="welcome-heading">Welcome, {profile?.name || 'Student'}! 👋</h1>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate('/chatbot')}>
          <div className="card-icon">🤖</div>
          <h3>Talk to AI</h3>
          <p>Tell me what you want to become</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/transform')}>
          <div className="card-icon">📸</div>
          <h3>Transform Photo</h3>
          <p>See yourself in your future career</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/gallery')}>
          <div className="card-icon">🖼️</div>
          <h3>My Gallery</h3>
          <p>View all your transformations</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/dashboard')}>
          <div className="card-icon">👤</div>
          <h3>My Profile</h3>
          <p>{profile?.careerGoal || 'Update your profile'}</p>
        </div>
      </div>

      <div className="info-section">
        <h2>About Future Viz</h2>
        <p>
          Future Viz helps students visualize their dreams and aspirations. Through our interactive
          chatbot and AI-powered photo transformation, see yourself achieving your career goals!
        </p>
      </div>
    </div>
  )
}
