import app from './app.js'
import dotenv from 'dotenv'

dotenv.config();




const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`✅ Server running on ${port}`);
});
