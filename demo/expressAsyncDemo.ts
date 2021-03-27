import * as express from 'express';
var app = express();

const port = 3000;

const delayFunction = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 200);
  });
};

app.use(async (req, res, next) => {
  console.log('m1');
  await delayFunction();
  await next();
  console.log('m1 end');
});

app.use(async (req, res, next) => {
  console.log('m2');
  await delayFunction();
  await next();
  console.log('m2 end');
});

app.use(async (req, res, next) => {
  console.log('m3');
});

app.listen(port);
