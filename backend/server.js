import express from "express"; 
import connectDB from "./config/mongodb.js";
const app = express();
const PORT = 3000;
connectDB()

app.get('/', (req, res) => {
  res.send('Hello Shivani');
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});