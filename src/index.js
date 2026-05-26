import 'dotenv/config';
import { validateEnv } from './config/validateEnv.js';
validateEnv();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { connectDB } from './config/db.js';

import authRouter        from './routes/auth.js';
import stateRouter       from './routes/state.js';
import projectsRouter    from './routes/projects.js';
import categoriesRouter  from './routes/categories.js';
import servicesRouter    from './routes/services.js';
import testimonialsRouter from './routes/testimonials.js';
import teamRouter        from './routes/team.js';
import processRouter     from './routes/process.js';
import messagesRouter    from './routes/messages.js';
import contentRouter     from './routes/content.js';
import uploadRouter      from './routes/upload.js';

await connectDB();

const app = express();

app.use(helmet());
app.use(compression());
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  ...(process.env.PRODUCTION_URL ? [process.env.PRODUCTION_URL] : []),
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/api/auth',         authRouter);
app.use('/api/state',        stateRouter);
app.use('/api/projects',     projectsRouter);
app.use('/api/categories',   categoriesRouter);
app.use('/api/services',     servicesRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/team',         teamRouter);
app.use('/api/process',      processRouter);
app.use('/api/messages',     messagesRouter);
app.use('/api/content',      contentRouter);
app.use('/api/upload',       uploadRouter);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
