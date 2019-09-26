import User from '../models/User';
import Meetup from '../models/Meetup';
import File from '../models/File';

class OrganizingController {
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
}

export default new OrganizingController();
