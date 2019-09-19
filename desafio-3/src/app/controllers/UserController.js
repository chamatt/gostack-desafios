import to from 'await-to-js';
import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const [serverError, userExists] = await to(
      User.findOne({
        where: {
          email: req.body.email,
        },
      })
    );
    if (serverError) return res.status(500);

    if (userExists)
      return res.status(400).json({
        error: 'Email already exists',
      });

    const [badRequest, { id, name, email }] = await to(User.create(req.body));

    if (badRequest)
      return res.status(400).json({
        error:
          'There was a problem with the request. Please, check the entered fields and try again.',
      });

    return res.json({ id, name, email });
    // return res.status(400).json({ error: err });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, oldPassword, password } = req.body;

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.json({ error: 'User does not exists' });
    }

    if (email !== user.email) {
      const [serverError, userExists] = await to(
        User.findOne({
          where: {
            email: req.body.email,
          },
        })
      );
      if (serverError) return res.status(500);

      if (userExists)
        return res.status(400).json({
          error: 'Email already exists',
        });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }
    if (password && !oldPassword) {
      return res.status(401).json({
        error: 'You need to provide the old password in order to change it',
      });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();
