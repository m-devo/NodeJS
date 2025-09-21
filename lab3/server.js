import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import todoRoutes from './routes/todoRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/todos', todoRoutes);


app.listen(port, () => {
    console.log(`Server is running.`);
    console.log(`http://localhost:${port}`);
    console.log(`http://localhost:${port}/api/todos`);
});

