import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import router from './routes/router.js'

const app = express();

dotenv.config();

app.use(cors());
app.use(json());

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.use(router);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log("server runnig on port " + PORT));
