import to from 'await-to-js';
// import * as Yup from 'yup';
// import User from '../models/User';
import Subscription from '../models/Subscription';

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
      });
    }
    return res.json(subscription);
  }

  async index(req, res) {
    const [getSubscriptionsError, subscriptions] = await to(
      Subscription.findAll({ where: { user_id: req.userId } })
    );
    if (getSubscriptionsError) {
      return res.status(400).json({
        error:
          'There was a error getting your subscription, please try again in a few moments',
      });
    }
    return req.res(subscriptions);
  }
}

export default new SubscriptionController();
