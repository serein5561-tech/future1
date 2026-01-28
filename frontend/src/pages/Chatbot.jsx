import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Chatbot.css'

export default function Chatbot({ user }) {
  const [greeting, setGreeting] = useState('')
  const [options, setOptions] = useState([])
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchGreeting()
  }, [])

  const fetchGreeting = async () => {
    try {
      const response = await axios.get('/api/chatbot/greeting')
      setGreeting(response.data.message)
      setOptions(response.data.options)
      setMessages([{ type: 'bot', text: response.data.message }])
    } catch (error) {
      console.error('Error fetching greeting:', error)
    }
  }

  const handleCareerSelect = async (career) => {
    setLoading(true)
    setMessages([...messages, { type: 'user', text: career }])

    try {
      const response = await axios.post('/api/chatbot/chat', { userInput: career })
      setMessages((prev) => [...prev, { type: 'bot', text: response.data.message }])

      if (response.data.isConfirmed) {
        setSelectedCareer(career)
        // Save to profile
        const token = localStorage.getItem('authToken')
        await axios.put(
          '/api/auth/profile',
          { careerGoal: career },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
    } catch (error) {
      setMessages((prev) => [...prev, { type: 'bot', text: 'Sorry, something went wrong.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleProceedToTransform = () => {
    if (selectedCareer) {
      navigate('/transform', { state: { career: selectedCareer } })
    }
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>🤖 Career Guide AI</h1>
        <button className="btn-back" onClick={() => navigate('/dashboard')}>← Back</button>
      </div>

      <div className="chatbot-box">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              {msg.type === 'bot' && <span className="emoji">🤖</span>}
              <div className="message-content">{msg.text}</div>
              {msg.type === 'user' && <span className="emoji">👤</span>}
            </div>
          ))}
        </div>

        {!selectedCareer && options.length > 0 && (
          <div className="options">
            {options.map((career) => (
              <button
                key={career}
                className="option-btn"
                onClick={() => handleCareerSelect(career)}
                disabled={loading}
              >
                {career}
              </button>
            ))}
          </div>
        )}

        {selectedCareer && (
          <div className="confirmation">
            <p>Great choice! You want to become a <strong>{selectedCareer}</strong></p>
            <button className="btn-primary" onClick={handleProceedToTransform}>
              Continue to Photo Transform →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
