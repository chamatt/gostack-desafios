import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.INTEGER,
        description: Sequelize.INTEGER,
        location: Sequelize.INTEGER,
        date: Sequelize.DATE,
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.File, { foreignKey: 'file_id', as: 'banner' });
  }
}

export default Meetup;
