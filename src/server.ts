import 'reflect-metadata';
import { AppDataSource } from './data-source';
import app from './app';
import { Logger } from './utils/logger';

const logger = new Logger('Server');
const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('❌ Failed to start server', error);
  });
