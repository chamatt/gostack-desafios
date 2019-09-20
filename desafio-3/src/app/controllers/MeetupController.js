import to from 'await-to-js';
import * as Yup from 'yup';
import { isBefore, isAfter, parseISO, formatDistance } from 'date-fns';
import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(3),
      description: Yup.string()
        .required()
        .min(3),
      location: Yup.string().required(),
      date: Yup.date().required(),
      fileId: Yup.number().required(),
    });

    const { title, description, location, date, fileId } = req.body;

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (fileId) {
      const [fileError, file] = await to(File.findByPk(fileId));
      if (fileError)
        return res
          .status(400)
          .json({ error: 'There was an error while looking for the banner' });
      if (!file)
        return res.status(404).json({ error: 'This banner does not exists' });
    }

    if (isBefore(parseISO(date), new Date())) {
      return res.status(400).json({
        error: `The date you selected was ${formatDistance(
          parseISO(date),
          new Date()
        )} ago, but meetup dates can't be in the past`,
      });
    }

    const [createMeetupError, meetup] = await to(
      Meetup.create({
        title,
        description,
        location,
        date,
        file_id: fileId,
        user_id: req.userId,
      })
    );
    if (createMeetupError)
      res.status(400).json({
        error:
          'There was an error when trying to create a meetup, please try again in a few moments',
        details: createMeetupError,
      });
    return res.json(meetup);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId,
      },
      order: ['date'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
        { model: File, as: 'banner', attributes: ['id', 'path', 'url'] },
      ],
    });
    return res.json(meetups);
  }

  async update(req, res) {
    // const { title, description, location, date, fileId } = req.body;
    const [meetupFindError, meetup] = await to(
      Meetup.findByPk(req.params.meetupId)
    );
    if (meetupFindError)
      return res.status(400).json({
        error:
          'Theres was a error looking for this meetup, please try again in a few moments',
      });
    if (!meetup) return res.status(404).json({ error: 'Meetup not found' });
    if (meetup.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "You don't have permission to edit this meetup" });
    }
    if (isAfter(meetup.date, new Date())) {
      return res.status(401).json({
        error: `This meetup happened ${formatDistance(
          meetup.date,
          new Date()
        )} ago, you can only edit meetups that haven't happened yet`,
      });
    }
    // const [updateMeetupError,updatedMeetup] =  await meetup.update({
    //   ...meetup,

    // })
    return res.json();
  }

  async delete(req, res) {
    const { meetupId } = req.params;
    const [meetupFindError, meetup] = await to(Meetup.findByPk(meetupId));
    if (meetupFindError)
      return res.status(400).json({
        error:
          'Theres was a error looking for this meetup, please try again in a few moments',
      });
    if (!meetup) return res.status(404).json({ error: 'Meetup not found' });
    if (meetup.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "You don't have permission to delete this meetup" });
    }
    if (isAfter(meetup.date, new Date())) {
      return res.status(401).json({
        error: `This meetup happened ${formatDistance(
          meetup.date,
          new Date()
        )} ago, you can only delete meetups that haven't happened yet`,
      });
    }
    const [deleteError] = await to(
      Meetup.destroy({
        where: {
          id: meetupId,
        },
      })
    );
    if (deleteError)
      return res.status(400).json({
        error:
          'There was a problem deleting this meetup, please try again in a few moments',
      });
    return res.json(meetup);
  }
}

export default new MeetupController();
