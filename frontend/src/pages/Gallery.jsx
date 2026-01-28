import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Gallery.css'

export default function Gallery({ user }) {
  const [transformations, setTransformations] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTransformations()
  }, [])

  const fetchTransformations = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get('/api/transformations', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setTransformations(response.data)
    } catch (error) {
      console.error('Error fetching transformations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading gallery...</div>

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>🖼️ My Transformations</h1>
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
      </div>

      {transformations.length === 0 ? (
        <div className="empty-gallery">
          <p>No transformations yet!</p>
          <button
            className="btn-primary"
            onClick={() => navigate('/chatbot')}
          >
            Create Your First Transformation
          </button>
        </div>
      ) : (
        <div className="gallery-grid">
          {transformations.map((item) => (
            <div key={item._id} className="gallery-item">
              <div className="item-header">
                <span className="career">{item.career}</span>
                <span className="status">{item.status}</span>
              </div>
              {item.status === 'completed' ? (
                <>
                  <img src={item.transformedImageUrl} alt={item.career} />
                </>
              ) : (
                <div className="processing">Processing...</div>
              )}
              <div className="item-date">
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
