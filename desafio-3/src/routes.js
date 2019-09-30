import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionController from './app/controllers/SubscriptionController';
import OrganizingController from './app/controllers/OrganizingController';

const routes = new Router();

const upload = multer(multerConfig);
// User
routes.post('/users', UserController.store);
routes.put('/users', authMiddleware, UserController.update);

// Session
routes.post('/session', SessionController.store);

// File
routes.post(
  '/files',
  authMiddleware,
  upload.single('file'),
  FileController.store
);

// Meetup
routes.get('/meetups', authMiddleware, MeetupController.index);
routes.post('/meetups', authMiddleware, MeetupController.store);
routes.delete('/meetups/:meetupId', authMiddleware, MeetupController.delete);

// Organizing

routes.get('/organizing', authMiddleware, OrganizingController.index);

// Subscription
routes.post(
  '/meetups/:meetupId/subscription',
  authMiddleware,
  SubscriptionController.store
);

routes.get('/subscriptions', authMiddleware, SubscriptionController.index);

export default routes;
