export default {
  host: process.env.MAILHOG_HOST,
  port: '1025',
  from: '',
  auth: {},
  default: {
    from: 'Meetapp <noreply@meetapp.com>',
  },
};
