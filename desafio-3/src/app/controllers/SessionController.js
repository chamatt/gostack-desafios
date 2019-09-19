import jwt from 'jsonwebtoken';
import to from 'await-to-js';
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const [err, user] = await to(User.findOne({ where: { email } }));
    if (!user)
      return res.status(400).json({ error: 'User or password incorrect' });

    if (err) return res.status(400).json({ error: err });

    if (!password)
      return res.status(400).json({ error: 'Password is required' });

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new UserController();
