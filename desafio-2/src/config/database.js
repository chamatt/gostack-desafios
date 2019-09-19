module.exports = {
  dialect: 'postgres',
  host: '192.168.99.100',
  username: 'postgres',
  password: '123456',
  database: 'meetapp',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
