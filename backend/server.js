import express from "express"; 
import connectDB from "./config/mongodb.js";
import User from "./models/userModels.js";
import bcrypt from 'bcryptjs'; // ✅ Add this

const app = express();
app.use(express.json()); // ✅ Ensure JSON body is parsed

const PORT = 3000;
connectDB();

app.get('/', (req, res) => {
  res.send('Hello Shivani');
});

app.post('/api/signup', async (req, res) => {
  console.log("Request Body:", req.body); // ✅ Debug log

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // ✅ Fixed
});


