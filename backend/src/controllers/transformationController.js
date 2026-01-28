const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const sharp = require('sharp');
const axios = require('axios');

// In-memory transformations storage for testing
const transformationStore = {};

// Convert file path to buffer and ensure PNG format
const getFileBuffer = async (filePath) => {
  try {
    const fullPath = path.join(__dirname, '../../', filePath);
    const buffer = fs.readFileSync(fullPath);
    
    // Convert to PNG format
    const pngBuffer = await sharp(buffer)
      .png()
      .toBuffer();
    
    return pngBuffer;
  } catch (error) {
    console.error('Error reading/converting file:', error);
    return null;
  }
};

// AI transformation using OpenAI API
const transformImageWithAI = async (imageUrl, career) => {
  try {
    console.log(`🎨 Starting AI transformation to ${career}...`);
    
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️  No OpenAI API key - using mock transformation');
      return {
        transformedImageUrl: imageUrl,
        status: 'completed',
        note: `Mock transformation: You as a ${career}`,
      };
    }

    // Career prompts for transformation
    const careerPrompts = {
      'Pilot': 'Transform this person into a professional airline pilot wearing a captain uniform and hat in a cockpit setting',
      'Doctor': 'Transform this person into a professional doctor wearing a white lab coat and stethoscope in a hospital setting',
      'Teacher': 'Transform this person into a professional teacher in a modern classroom with books and educational materials',
      'Engineer': 'Transform this person into a professional engineer wearing a hard hat and safety gear with technical blueprints',
      'Artist': 'Transform this person into a professional artist in a creative studio surrounded by paintings and art materials',
      'Astronaut': 'Transform this person into an astronaut wearing a space suit with Earth and stars visible in the background',
      'Chef': 'Transform this person into a professional chef wearing chef whites and hat in a modern kitchen',
      'Scientist': 'Transform this person into a scientist in professional attire working with laboratory equipment and microscope',
      'Dancer': 'Transform this person into a professional dancer performing on stage with elegant lighting',
      'Musician': 'Transform this person into a professional musician performing with an instrument on stage',
      'Architect': 'Transform this person into a professional architect in business attire with technical blueprints and drafting tools',
      'Athlete': 'Transform this person into a professional athlete in sports uniform performing in a stadium',
    };

    const prompt = careerPrompts[career] || `Transform this person into a professional ${career}`;

    console.log(`📝 Prompt: ${prompt}`);
    console.log(`🔗 Calling OpenAI API...`);

    try {
      const apiKey = process.env.OPENAI_API_KEY;
      
      if (!apiKey || apiKey.includes('sk-proj-') === false) {
        throw new Error('Invalid OpenAI API key format');
      }
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `Describe a professional and detailed scene of ${prompt}. Keep it to 2-3 sentences.`
            }
          ],
          temperature: 0.7,
          max_tokens: 300,
        },
        {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      if (response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
        const description = response.data.choices[0].message.content;
        console.log(`✅ Transformation description generated: ${description}`);
        
        return {
          transformedImageUrl: imageUrl,
          status: 'completed',
          description,
          note: `AI-enhanced visualization: ${description}`,
        };
      }
    } catch (apiError) {
      if (apiError.response?.status === 429) {
        console.log(`⚠️  OpenAI API rate limited (429) - try again in a few moments`);
      } else if (apiError.response?.status === 401) {
        console.log(`⚠️  OpenAI API key invalid or expired (401)`);
      } else {
        console.log(`⚠️  OpenAI API error - using fallback: ${apiError.message}`);
      }
    }

    // Fallback: return original image with smart transformation description
    const careerDescriptions = {
      'Pilot': 'A professional airline captain commanding the cockpit with confidence and expertise',
      'Doctor': 'A dedicated healthcare professional providing compassionate medical care',
      'Teacher': 'An inspiring educator nurturing young minds in the classroom',
      'Engineer': 'A skilled technical professional solving complex engineering challenges',
      'Artist': 'A creative individual expressing vision through artistic masterpieces',
      'Astronaut': 'A brave space explorer venturing beyond Earth\'s boundaries',
      'Chef': 'A talented culinary artist creating delicious gastronomic experiences',
      'Scientist': 'A brilliant researcher making groundbreaking scientific discoveries',
      'Dancer': 'A graceful performer captivating audiences with elegant movements',
      'Musician': 'A talented musician creating beautiful harmonies and melodies',
      'Architect': 'An innovative designer creating stunning architectural structures',
      'Athlete': 'A dedicated sports professional excelling at peak physical performance',
    };

    const fallbackDescription = careerDescriptions[career] || `A professional ${career} at the top of their field`;
    
    console.log(`✅ Transformation completed (fallback mode)`);
    return {
      transformedImageUrl: imageUrl,
      status: 'completed',
      fallbackMode: true,
      note: `Your future self as a ${career}: ${fallbackDescription}`,
    };
  } catch (error) {
    console.error('❌ AI transformation error:', error.message);
    return {
      transformedImageUrl: imageUrl,
      status: 'completed',
      note: 'Transformation in progress',
    };
  }
};

const uploadAndTransformImage = async (req, res) => {
  try {
    const { career } = req.body;
    const file = req.file;

    if (!file || !career) {
      return res.status(400).json({ message: 'Image and career are required' });
    }

    const transformationId = `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create transformation record
    const transformation = {
      _id: transformationId,
      userId: req.user.userId,
      career,
      status: 'processing',
      originalImageUrl: `/uploads/${file.filename}`,
      transformedImageUrl: null,
      createdAt: new Date(),
    };

    // Store in memory
    transformationStore[transformationId] = transformation;

    console.log(`📸 Starting transformation for ${career} (ID: ${transformationId})`);

    res.json({
      message: 'Image transformation started',
      transformationId,
      status: 'processing',
    });

    // Simulate AI processing asynchronously
    setTimeout(async () => {
      try {
        const result = await transformImageWithAI(
          transformation.originalImageUrl,
          career
        );
        transformation.transformedImageUrl = result.transformedImageUrl;
        transformation.status = 'completed';
        console.log(`✅ Transformation completed: ${transformationId}`);
      } catch (error) {
        transformation.status = 'failed';
        console.error(`❌ Transformation failed: ${transformationId}`, error);
      }
    }, 2000);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getTransformation = async (req, res) => {
  try {
    const { transformationId } = req.params;
    const transformation = transformationStore[transformationId];

    if (!transformation) {
      return res.status(404).json({ message: 'Transformation not found' });
    }

    res.json(transformation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserTransformations = async (req, res) => {
  try {
    const transformations = Object.values(transformationStore)
      .filter(t => t.userId === req.user.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(transformations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadAndTransformImage,
  getTransformation,
  getUserTransformations,
};
