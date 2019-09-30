import to from 'await-to-js';
// import * as Yup from 'yup';
// import User from '../models/User';
import { Op } from 'sequelize';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import File from '../models/File';

class SubscriptionController {
  async store(req, res) {
    const { meetupId } = req.params;
    const [createSubscriptionError, subscription] = await to(
      Subscription.create({ user_id: req.userId, meetup_id: meetupId })
    );
    if (createSubscriptionError) {
      return res.status(400).json({
        error:
          'There was an error creating this subscription, please try again in a few moments.',
        details: createSubscriptionError,
      });
    }
    return res.json(subscription);
  }

  async index(req, res) {
    const [getSubscriptionsError, subscriptions] = await to(
      Subscription.findAll({
        where: {
          user_id: req.userId,
        },
        include: [
          {
            model: Meetup,
            as: 'meetup',
            attributes: ['id', 'title', 'description', 'location', 'date'],
            required: true,
            where: {
              date: {
                [Op.gt]: new Date(),
              },
            },
          },
        ],
        order: [[{ model: Meetup, as: 'meetup' }, 'date', 'asc']],
      })
    );
    console.log('yoooo', getSubscriptionsError);
    if (getSubscriptionsError) {
      return res.status(400).json({
        error:
          'There was a error getting your subscription, please try again in a few moments',
        details: JSON.stringify(getSubscriptionsError, null, 2),
      });
    }
    return res.json(subscriptions);
  }
}

export default new SubscriptionController();
