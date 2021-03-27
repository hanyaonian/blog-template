## 基于 Koa.js 搭建个人网站(一)：框架解析与项目搭建

首先上个博客链接：[猴子的学习日记](https://michaelhan.tech/).

## 一. 设计网站功能（需求分析）

个人网站的主要作用是什么？不同人的需求可能不大相同，我的需求如下：

1. 创建一个分享自己想法的平台(发布博文、个人介绍)
2. 提供一个技术讨论的空间（评论对话，可惜这个功能因安全原因被网警取消了）
3. 实践简单的后端应用开发与网站运维，增强知识储备

- 基础功能：总结需求前两点，这个网站的基础功能有：发布文章、发布/回复评论、提供一个文章列表页、个人介绍页面；
- 管理功能：当然，如果只有发布没有删除编辑，那说错话改不了、被人骂无法删除都会很尴尬，那么再加上：文章/留言管理；
- 安全需求：被网友攻击很糟糕，需要有一些安全共功能：人机校验(验证码)、接口鉴权、脏话屏蔽

需求确定了，就可以进行技术选型，看看通过什么技术去做开发。

## 二. 选择合适的开发框架（技术选型）

考虑到一个个人博客会是一个轻量应用，用不到太多复杂的功能，而且也希望自己能更多的参与到其中的开发，因此过滤掉一些内容过于充实的 web 框架，例如 egg.js。实际上比较流行的 web 服务框架不外乎 express 和 koa，它们都支持中间件，适合增加一些自己的内容，可玩性强，那么就在这两个中看看！

### - express.js

一个活跃了很久的 web 框架，以前在校的时候还用过这个去做过一些基于模板引擎的 web 开发。express 有自己的路由功能，同时很轻量，性能也不错。其中间件使用看起来和 express 很相像，都是用 app.use 去注册中间件，然后当请求出来的时候按顺序执行中间件逻辑。express 是一个线性执行的方式去执行中间件(connect)，如下是 express 的中间件[示例](https://github.com/hanyaonian/blog-template)：

```js
// expressDemo
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

// 输出顺序如下：
// m1 -> m2 -> m3 -> m2 end -> m1 end
// 嗯？看起来好像也是洋葱圈哦
```

实际上，express 的中间件执行可以将其理解成如下结构。

```js
http.createServer(function (req, res) {
  m1 (req, res) { //m1 stuff...
    m2 (req, res) { // m2 stuff...
      m3 (req, res) { //m3 stuff }
	  //m2 end...
    }
	//m1 end...
  }
})
```

那么如果 express 中不按照同步的方式来执行中间件，而是异步的呢（详见 expressAsyncDemo）？输出变成了：

```js
//在每个方法前加入一个异步操作
const delayFunction = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 200);
  });
};
// 中间件的执行过程变更如下：
// ...
await delayFunction();
await next();
// ...
// 最终的输出顺序变成了：m1->m2->m1 end->m3->m2 end
```

阿这完全乱套了，因为前一个中间件的后续执行不会等待后一个中间件的执行完成再走到后一步。执行到了 next 就会到下一个中间件，任务队列会继续往下走而不是等待完成～～～即是中间的 await next()是没有作用的。

### - koa.js

koa 介绍：Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。

Koa.js 比较出名的点就是他的“洋葱圈模型”。执行 demo 内的两个示例可以发现，koa 对 es6 的 async/await 支持的非常好。两个 demo 的访问输出都会是（m1->m2->m1 end->m3->m2 end），不会像 express 那样异步时不同于“洋葱圈结构”，这得益于其中间件的实现方式：

```js
// koa-compose，其中间件实现的代码逻辑
function compose(middleware) {
  //...
  // context是上下文，req，res都在其上面
  return function (context, next) {
    // last called middleware #
    let index = -1;
    // 执行第一个中间件
    return dispatch(0);
    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error('next() called multiple times'));
      index = i;
      // 获取对应的中间件
      let fn = middleware[i];
      // 已执行完
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        //Promise.resolve具有等待功能。并且会继续返回Promise
        // 这点可以看本人的(https://michaelhan.tech/article/60463afcb9e6607a5900df19)进行理解
        // 所以中间件的执行会按顺序往下走
        return Promise.resolve(
          fn(context, function next() {
            return dispatch(i + 1);
          })
        );
      } catch (err) {
        // 这也可以看出为什么说错误处理是增强的：任意一个中间件环节reject或者抛出err，都可以在最外层被捕捉到
        return Promise.reject(err);
      }
    }
  };
}
```

所以，koa 的中间件的执行结构实际上是这样的, 会将其中的执行结构变为更容易理解的同步顺序执行结构：

```js
Promise.resolve(async () => {
  console.log('m1');
  await Promise.resolve(async ()=> {
    console.log(m2)
    await Promise.resolve(async ()=> {
      console.log(m3)
     });
     console.log(m2 end)
  })
  console.log('m1 end');
})
```

### 数据库选择

emmmm 网上看了下 nodejs 项目的一般都是 mysql 或者 mongodb，实际上更希望用 mysql 多一点，一个是工作中的后端伙计都是用这个，想着可以接触一下，另一方面则是注解代码看着很爽。。但最终还是选择了 mongodb，因为学习成本更低一些而且 JSON 非关系型数据库日后更好拓展。

## 三. 项目搭建（前期开发）

一个合理的项目结构对后续的代码维护、功能拓展都十分重要。那么先看看项目的结构
![项目结构](https://michaelhan.tech/images/8d22d6ad8f548362e9f433f575c2c314.jpg)

- **assets** 这个是存放项目的静态资源的。（在这存放的是脏话列表，屏蔽骂我的人）
- **controllers** 业务逻辑层的代码。Controler 负责请求转发，接受页面过来的参数，传给 Service 处理，接到返回值，再处理传给页面，直接接触到业务层。
- **middlewares** 自己的中间件。
- **models** 数据库存储模型实例定义的位置。
- **routes** 路由控制，即是控制接口地址。
- **services** 对 models（数据库层面）的操作的封装，即封装成一个服务供 controller 调用。

为什么不直接 controller 去操作数据库，再返回数据给到页面呢？这样不是少了一层吗？

- 对于简单的应用来说，随便怎么写都可以，全部代码逻辑放到一个 appjs 里都 ok，但是如果项目大起来了，就需要考虑代码的可维护性，以及降低耦合。

比如：接口 A 要返回组合的数据 1、2、3 给到用户，接口 B 要返回 2、3 给到用户，如果 A、B 两个都自己有一套存取数据的逻辑，那么 2、3 存取的逻辑会重复，并且让代码更臃肿，重复代码会非常多。

service 层做的事情就是 service1 返回 1，service2 返回 2... service 不关心参数是否正确这样的业务逻辑，而是只做存、取。

下次更新的内容是：中间件的实现以及业务逻辑的数据处理
