const corsHandler: Record<string, unknown> = {
  exposeHeaders: ['WWW-Authenticate', 'captcha'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
};

console.log('cors working');

export default corsHandler;
