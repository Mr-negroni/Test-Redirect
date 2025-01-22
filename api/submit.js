// pages/api/submit.js
import mongoose from 'mongoose';

// MongoDB connection string (use the string you copied from MongoDB Atlas)
const mongoURI = "mongodb+srv://161612saurabh:FZA5NFDswS5b6Tlm@data.v6ica.mongodb.net/?retryWrites=true&w=majority&appName=Data";

// MongoDB connection function
const connectDb = async () => {
  if (mongoose.connections[0].readyState) return; // Already connected
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Define schema for the submission
const submissionSchema = new mongoose.Schema({
  name: String,
  address: String,
  mobile: String,
  timestamp: { type: Date, default: Date.now },
});

// Create the model for form submissions
const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, address, mobile } = req.body;

    // Check if all required fields are filled
    if (!name || !address || !mobile) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Connect to the database
      await connectDb();
      
      // Create a new submission document
      const newSubmission = new Submission({ name, address, mobile });

      // Save the data to MongoDB
      await newSubmission.save();
      
      // Respond with a success message
      res.status(200).json({ message: 'Form submitted successfully!' });
    } catch (error) {
      console.error('Error saving data to MongoDB:', error);
      res.status(500).json({ error: 'Error saving form data' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}