// app.js

const express = require('express');
const path = require('path'); // Node.js path module
const mongoose = require('mongoose');
const config = require('./config');
const bodyparser = require('body-parser')
const bcrypt = require("bcrypt");
const Customer = require("");


// const routes = require('./routes/routes');
path1 = path.format({root:"E:/Hackathon/CarServiceCenter/"})
console.log(path1)
// Initialize Express app
const app = express();

app.use(bodyparser.urlencoded({extended:true}))
// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error.message);
});

// Middleware
app.use(express.json()); // Parse JSON bodies
// Add more middleware as needed...

// Serve static files from the 'public' directory


// Routes
// app.use('/api', routes); // Prefix all API routes with '/api'

// Home page route
app.get('/', (req, res) => {
  res.sendFile(path.join(path1, 'public', 'index.html'));
});

app.get('/loginpage',(req,res)=>{
  res.sendFile("E:\\Hackathon\\CarServiceCenter\\src\\server\\login.html")
})

app.get('/customer', (req, res) => {
  res.sendFile(path.join(path1, 'src', 'customers/add_on_services.html'));
})


// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await Customer.findOne({ email });

    // If user not found, return an error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Get user's role
    const role = user.role;

    // Redirect based on user role
    if (role === "CUSTOMER") {
      // Redirect to customer page
      res.redirect("/customer");
    } else if (role === "ADMIN") {
      // Redirect to admin page
      res.redirect("/admin");
    } else {
      // Handle other roles or unexpected cases
      res.status(403).json({ message: "Unauthorized role" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


const PORT =  3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;