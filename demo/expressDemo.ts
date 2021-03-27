import * as express from 'express';
var app = express();

const port = 3000;

app.use((req, res, next) => {
  console.log('m1');
  next();
  console.log('m1 end');
});

app.use((req, res, next) => {
  console.log('m2');
  next();
  console.log('m2 end');
});

app.use((req, res, next) => {
  console.log('m3');
});

app.listen(port, () => {
  console.log(`hello word`);
});
