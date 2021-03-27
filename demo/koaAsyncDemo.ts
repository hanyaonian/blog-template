import * as Koa from 'koa';

const app = new Koa();

const delayFunction = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 200);
  });
};

app.use(async (context, next) => {
  console.log('m1');
  await delayFunction();
  await next();
  console.log('m1 end');
});

app.use(async (context, next) => {
  console.log('m2');
  await delayFunction();
  await next();
  console.log('m2 end');
});

app.use(async (context, next) => {
  console.log('m3');
  next();
});
app.listen(3001);
