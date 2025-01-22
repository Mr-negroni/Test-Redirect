import mongoose from 'mongoose';
import Cors from 'cors';

// Initialize CORS
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
});

// MongoDB connection
const mongoURI = "mongodb+srv://161612saurabh:FZA5NFDswS5b6Tlm@data.v6ica.mongodb.net/?retryWrites=true&w=majority&appName=Data";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const submissionSchema = new mongoose.Schema({
  name: String,
  address: String,
  mobile: String,
  timestamp: { type: Date, default: Date.now },
});

const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Run CORS middleware
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    const { name, address, mobile } = req.body;

    if (!name || !address || !mobile) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const newSubmission = new Submission({ name, address, mobile });
      await newSubmission.save();
      return res.status(200).json({ message: 'Form submitted successfully!' });
    } catch (error) {
      return res.status(500).json({ error: 'Error saving form data' });
    }
  } else {
    // Handle any request method that is not POST
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
