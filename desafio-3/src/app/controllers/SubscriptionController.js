import to from 'await-to-js';
// import * as Yup from 'yup';
// import User from '../models/User';
import { parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import { Op } from 'sequelize';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Mail from '../../lib/Mail';

const serverError = (req, res) => {
  return res.status(500).json({
    error: 'Internal server error',
  });
};

class SubscriptionController {
  async store(req, res) {
    const { meetupId } = req.params;
    const [getMeetupError, meetup] = await to(
      Meetup.findOne({
        where: {
          id: meetupId,
        },
        include: {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'name'],
          required: true,
        },
      })
    );

    if (getMeetupError) return serverError();
    if (!meetup) {
      return res.status(404).json({
        error: 'Meetup not found',
      });
    }

    if (meetup.user_id === res.userId) {
      return res.status(400).json({
        error: "You can't subscribe to a meetup that you are organizing.",
      });
    }
    if (isBefore(new Date(), parseISO(meetup.date))) {
      return res.status(400).json({
        error: "You can't subscribe to meetup that already happened.",
      });
    }

    const [getSameMeetupError, sameMeetup] = await to(
      Subscription.count({
        where: {
          meetup_id: meetupId,
        },
      })
    );
    if (getSameMeetupError) return serverError();
    if (sameMeetup) {
      return res.status(400).json({
        error: "You're already subscribed to this meetup",
      });
    }

    const [sameTimeMeetupsError, sameTimeMeetups] = await to(
      Subscription.count({
        where: {
          user_id: req.userId,
        },
        include: [
          {
            model: Meetup,
            as: 'meetup',
            attributes: ['id', 'title', 'description', 'location', 'date'],
            where: {
              date: {
                [Op.eq]: meetup.date,
              },
            },
          },
        ],
      })
    );
    if (sameTimeMeetupsError) serverError();
    if (sameTimeMeetups) {
      return res.status(400).json({
        error:
          "You can't subscribe to an meetup where you already have another at the same date",
      });
    }

    const [createSubscriptionError, subscription] = await to(
      Subscription.create({ user_id: req.userId, meetup_id: meetupId })
    );
    if (createSubscriptionError) serverError();

    await Mail.sendMail({
      to: `${meetup.user.name} <${meetup.user.email}>`,
      subject: 'Inscrição no Meetup',
      template: 'subscription',
      context: {
        date: format(meetup.date, "'Dia' dd 'de' MMMM 'às' H:mm'h'", {
          locale: pt,
        }),
        meetup,
      },
    });

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
    if (getSubscriptionsError) {
      return res.status(400).json({
        error:
          'There was a error getting your subscription, please try again in a few moments',
      });
    }

    return res.json(subscriptions);
  }
}

export default new SubscriptionController();
