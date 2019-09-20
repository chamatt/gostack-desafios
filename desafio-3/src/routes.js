import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';
import MeetupController from './app/controllers/MeetupController';

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
routes.post('/meetups', authMiddleware, MeetupController.store);
routes.get('/meetups', authMiddleware, MeetupController.index);
routes.delete('/meetups/:meetupId', authMiddleware, MeetupController.delete);

export default routes;
