### Koa pratice
一个简易的个人博客

including: 
- Typescript
- Eslint
- Koa
- MongoDB with mongoose
- Authentication Security(JSONwebToken)
- Nodemon(dev) / pm2(prod)

#### 开始项目 Getting Start

- git clone <repoaddress>
- cd MichaelBlog/serve
- install & start mongodb before starting serve
  - in Centos, run: sudo systemctl start mongod
  - in Windows, run: net start mongod
  - in MacOs
  ```
  brew install mongodb
  mongod
  ```
- npm install
- npm run serve

#### 在生产环境下启动服务 Start project in production mode

- `pm2 start ecosystem.config.js`

#### npm命令

- `start` - using ts-node to start koa serve,
- `build` - transpile TypeScript to JavaScript,
- `serve` - using nodemon to start watch mode to automatically transpile source files,
- `lint` - lint tscode,
