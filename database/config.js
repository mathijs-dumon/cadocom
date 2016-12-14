module.exports = {
  'secret': 'cadocomIsNeat',
  'database': (process.env.MONGODB_URI!=undefined) ? process.env.MONGODB_URI : 'mongodb://localhost/cadocom'
};