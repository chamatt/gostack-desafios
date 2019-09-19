import to from 'await-to-js';
import Meetup from '../models/Meetup';
import File from '../models/File';

class MeetupController {
  async store(req, res) {
    const { title, description, location, date, fileId } = req.body;

    const file = await File.findByPk(fileId);
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
    const meetups = await Meetup.findAll();
    return res.json(meetups);
  }
}

export default new MeetupController();
