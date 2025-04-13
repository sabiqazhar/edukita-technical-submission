import express from 'express';
import usersRoutes from './routes/users.routes';
import assignmentsRoutes from './routes/assignments.routes';
import gradesRoutes from './routes/grades.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/assignments', assignmentsRoutes);
app.use('/grades', gradesRoutes);

app.use(errorHandler);

export default app;
