const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const app = require('./src/app');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('Connect mongodb successfull!');
});

const server = app.listen(process.env.PORT, process.env.LOCAL_HOST, () => {
  console.log('Running app with port 8000');
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION 💥 Shuting dowm...');
  server.close(() => {
    process.exit(1);
  });
});
