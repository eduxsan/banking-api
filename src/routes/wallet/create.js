module.exports = {
  method: 'GET',
  path: '/wallet',
  options: {
    tags: ['api'],
  },
  handler: () => {
    return 'hello world';
  },
}
