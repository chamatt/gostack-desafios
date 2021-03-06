import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// User
routes.post('/users', UserController.store);
routes.put('/users', authMiddleware, UserController.update);

// Session
routes.post('/session', SessionController.store);

export default routes;
