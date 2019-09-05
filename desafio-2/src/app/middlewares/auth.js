import jwt from 'jsonwebtoken';
import to from 'await-to-js';
import { promisify } from 'util';
import authConfig from '../../config/auth';

const verifyAsync = promisify(jwt.verify);

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token not provided' });
  const [, token] = authHeader.split(' ');
  const [err, decoded] = await to(verifyAsync(token, authConfig.secret));

  if (err) return res.status(401).json({ error: 'Token Invalid' });

  req.userId = decoded.id;

  next();
};
