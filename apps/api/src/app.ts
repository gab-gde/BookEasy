import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/error';

const app = express();
app.use(helmet());
app.use(cors({ origin: [config.frontUrl, 'http://localhost:3000'], credentials: true, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/', routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
