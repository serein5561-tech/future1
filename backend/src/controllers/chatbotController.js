// Simple chatbot responses for career selection
const careerOptions = [
  'Pilot',
  'Doctor',
  'Teacher',
  'Engineer',
  'Artist',
  'Astronaut',
  'Chef',
  'Scientist',
  'Dancer',
  'Musician',
  'Architect',
  'Athlete',
];

const getChatbotGreeting = (req, res) => {
  try {
    res.json({
      message: "Hello! I'm your career guide. What do you want to become in the future?",
      options: careerOptions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const processChatbotInput = (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({ message: 'User input is required' });
    }

    // Simple response logic
    let response = '';
    let selectedCareer = null;

    // Check if user input matches any career option
    const matchedCareer = careerOptions.find(
      (career) =>
        userInput.toLowerCase().includes(career.toLowerCase()) ||
        career.toLowerCase().includes(userInput.toLowerCase())
    );

    if (matchedCareer) {
      selectedCareer = matchedCareer;
      response = `Great! So you want to become a ${matchedCareer}. That's awesome! 🎉\n\nNow let's take a photo of you and I'll transform it to show you as a ${matchedCareer}!`;
    } else {
      response =
        "I'm not sure which career you mean. Here are some options I can help with:\n" +
        careerOptions.join(', ') +
        '\n\nWhich one interests you?';
    }

    res.json({
      message: response,
      selectedCareer,
      isConfirmed: !!selectedCareer,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChatbotGreeting,
  processChatbotInput,
};
