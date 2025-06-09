import express, { Request, Response, NextFunction, Router } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connect } from '@config/database/db';
import errorHandler from 'helper/error_helper';
import routes from './routes/index';
import { apiError } from '@utils/response';
import mongoose from 'mongoose';
import passport from './utils/passport_setup';
import session from 'express-session';
import googleAuthRoutes from '../src/user/routes/google_login_routes';
const path = require('path');
const router = Router();
dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(
  async (err: SyntaxError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      return await apiError(
        'The request is failed due to bad syntax',
        {
          explanation: 'This is json parsing issue.',
        },
        400,
      ).then((eror) => {
        res.status(400).json(eror);
      });
    }

    next();
  },
);

// const PORT = process.env.PORT || 3000;
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

connect()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database', err);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

router.get(
  '/api/v1/model',
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { modelName } = req.query;

      // Validate the modelName parameter
      if (!modelName || typeof modelName !== 'string') {
        res
          .status(400)
          .json({ error: 'Please provide a valid modelName parameter' });
        return;
      }

      // Check if the model exists
      if (!mongoose.modelNames().includes(modelName)) {
        res.status(404).json({ error: `Model '${modelName}' not found` });
        return;
      }
      const model = mongoose.model(modelName) as mongoose.Model<
        any,
        any,
        any,
        any,
        any,
        any
      > & {
        getFieldMetadata?: () => object;
        getTableFields?: () => string[];
        getSingleInstanceState: () => boolean;
      };
      // Check if the `getFieldMetadata` method is implemented
      if (typeof model.getFieldMetadata !== 'function') {
        res.status(500).json({
          error: `The model '${modelName}' does not implement 'getFieldMetadata'`,
        });
        return;
      }

      if (typeof model.getTableFields !== 'function') {
        res.status(500).json({
          error: `The model '${modelName}' does not implement 'getTableFields'`,
        });
        return;
      }

      if (typeof model.getSingleInstanceState !== 'function') {
        res.status(500).json({
          error: `The model '${modelName}' does not implement 'getSingleInstanceState'`,
        });
        return;
      }

      // Call the `getFieldMetadata` method and send the response
      const metadata = model.getFieldMetadata();
      res.status(200).json({
        metadata,
        tableFields: model.getTableFields() || [],
        singleInstanceState: model.getSingleInstanceState() || false,
      });
    } catch (error) {
      next(error); // Pass errors to the error handler
    }
  },
);

app.use(passport.initialize());
app.use(passport.session());
app.use('', router);
app.use('/api/v1', routes);
app;
app.use('/api/v1', googleAuthRoutes);

app.get('/google', (req: Request, res: Response) => {
  res.send("<a href='/api/v1/user/auth/google'>Google Login</a>");
});

app.use(async (req: Request, res: Response, next: NextFunction) => {
  const errorResponse = await apiError(
    'Route not found',
    { explanation: 'The requested route is not found' },
    404,
  );
  res.status(404).json(errorResponse);
});

app.use(errorHandler);

process.on('uncaughtException', (err) => {
  console.log('Global error is ', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
