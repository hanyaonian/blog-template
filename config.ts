import * as path from 'path';

export default {
  port: '8000',
  secret: 'michaelSecret',
  publicDir: path.resolve(__dirname, './public'),
  logPath: path.resolve(__dirname, './logs/server.log'),
  hashMethod: 'sha256',
  fileConfig: {
    maxAge: 365 * 24 * 60 * 60,
    prefix: '/images'
  },
  mongoDB: {
    host: '127.0.0.1',
    port: '27017',
    database: 'blog'
  }
};
