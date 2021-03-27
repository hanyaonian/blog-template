import * as crypto from 'crypto';
import { IncomingMessage } from 'http';
import config from '../config';
const multer = require('@koa/multer');

const targetDir = config.publicDir;
const storage = multer.diskStorage({
  destination: targetDir,
  filename: function (req: IncomingMessage, file: any, cb: Function) {
    // store file with md file name, using filename + timestamp
    const md5Generator = crypto.createHash('md5');
    const uniqueFileName = md5Generator
      .update(`${file.originalname}${new Date().getTime()}`)
      .digest('hex');
    const fileType = file.originalname.split('.')[1] || '';
    cb(null, `${uniqueFileName}.${fileType}`);
  }
});

const upload = multer({ storage: storage });

export default upload;
