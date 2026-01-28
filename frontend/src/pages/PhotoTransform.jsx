import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import './PhotoTransform.css'

export default function PhotoTransform({ user }) {
  const [career, setCareer] = useState('')
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [transformed, setTransformed] = useState(null)
  const [transformationId, setTransformationId] = useState(null)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [useCamera, setUseCamera] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.career) {
      setCareer(location.state.career)
    }
  }, [location])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
      setUseCamera(false)
    }
  }

  const startCamera = async () => {
    try {
      // First, set the camera flag to render the video element
      setUseCamera(true)
      
      // Wait for the video element to be rendered
      setTimeout(async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
          })
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          } else {
            throw new Error('Video element not found')
          }
        } catch (error) {
          console.error('Camera error:', error)
          setUseCamera(false)
          if (error.name === 'NotAllowedError') {
            alert('Camera access was denied. Please enable camera permissions in your browser settings.')
          } else if (error.name === 'NotFoundError') {
            alert('No camera device found. Please connect a camera.')
          } else if (error.name === 'NotReadableError') {
            alert('Camera is already in use by another application.')
          } else {
            alert('Could not access camera: ' + error.message)
          }
        }
      }, 100)
    } catch (error) {
      console.error('Camera setup error:', error)
      setUseCamera(false)
      alert('Could not setup camera')
    }
  }

  const capturePhoto = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
      setPhoto(file)
      setPreview(canvas.toDataURL())

      // Stop camera
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop())
      }
      setUseCamera(false)
    })
  }

  const handleTransform = async (e) => {
    e.preventDefault()

    if (!photo || !career) {
      alert('Please select a photo and career')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('image', photo)
      formData.append('career', career)

      const token = localStorage.getItem('authToken')
      const response = await axios.post('/api/transformations/transform', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      setTransformationId(response.data.transformationId)

      // Poll for transformation status
      let completed = false
      let attempts = 0
      while (!completed && attempts < 30) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const statusResponse = await axios.get(
          `/api/transformations/${response.data.transformationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (statusResponse.data.status === 'completed') {
          setTransformed(statusResponse.data)
          completed = true
        } else if (statusResponse.data.status === 'failed') {
          throw new Error('Transformation failed')
        }
        attempts++
      }

      if (!completed) {
        throw new Error('Transformation timeout')
      }
    } catch (error) {
      alert(error.message || 'Transformation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="transform-container">
      <div className="transform-header">
        <h1>📸 Photo Transformation</h1>
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
      </div>

      <div className="transform-box">
        {!transformed ? (
          <>
            <div className="career-selection">
              <label htmlFor="career">What do you want to become?</label>
              <input
                id="career"
                type="text"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                placeholder="e.g., Pilot, Doctor, Teacher"
              />
            </div>

            <div className="photo-section">
              {useCamera ? (
                <div className="camera-container">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      borderRadius: '12px',
                      marginBottom: '15px',
                    }}
                  />
                  <canvas
                    ref={canvasRef}
                    width="320"
                    height="240"
                    style={{ display: 'none' }}
                  />
                  <button className="btn-primary" onClick={capturePhoto}>
                    📷 Capture Photo
                  </button>
                </div>
              ) : preview ? (
                <div className="preview-section">
                  <img src={preview} alt="Preview" className="preview-image" />
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setPreview(null)
                      setPhoto(null)
                    }}
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <div className="photo-options">
                  <button
                    className="photo-option-btn"
                    onClick={() => fileInputRef.current.click()}
                  >
                    📁 Upload Photo
                  </button>
                  <button className="photo-option-btn" onClick={startCamera}>
                    📷 Take Photo
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>

            {preview && (
              <button className="btn-primary" onClick={handleTransform} disabled={loading}>
                {loading ? '✨ Transforming...' : '✨ Transform Now'}
              </button>
            )}
          </>
        ) : (
          <div className="result-section">
            <h2>Your Future Self as a {career}! 🎉</h2>
            <div className="result-images">
              <div className="image-box">
                <p className="image-label">Original</p>
                <img src={preview} alt="Original" />
              </div>
              <div className="arrow">→</div>
              <div className="image-box">
                <p className="image-label">Transformed</p>
                <img src={transformed.transformedImageUrl} alt="Transformed" />
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="btn-primary"
                onClick={() => {
                  setTransformed(null)
                  setPreview(null)
                  setPhoto(null)
                }}
              >
                Try Another
              </button>
              <button className="btn-secondary" onClick={() => navigate('/gallery')}>
                View Gallery
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
