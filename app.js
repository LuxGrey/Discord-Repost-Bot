import 'dotenv/config';
import express from 'express';
import shareRoutes from './routes/shareRoutes.js';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

app.use(express.json()) // for parsing application/json

app.use('/share', shareRoutes);

app.listen(PORT, () => {
    console.log('Listening on port', PORT);
});