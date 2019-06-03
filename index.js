import Koa from "koa"
import { createSchedule, checkFile, job } from './utils/schedule'
import routers from './route'

const app = new Koa();

const PORT = 3000

createSchedule({
  hour: 16,
  minute: 3,
  second: 0
})
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
  ctx.set("Content-Type", "application/json;charset=utf-8");
  ctx.set("Access-Control-Allow-Credentials", true);
  ctx.set("Access-Control-Max-Age", 300);
  /*
  CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：
      Cache-Control、
      Content-Language、
      Content-Type、
      Expires、
      Last-Modified、
      Pragma。
  */
  // 需要获取其他字段时，使用Access-Control-Expose-Headers，
  // getResponseHeader('myData')可以返回我们所需的值
  ctx.set("Access-Control-Expose-Headers", "myData");

  await next();
})

app.use(routers.routes()).use(routers.allowedMethods())

app.listen(3000, () => {
  console.log(`server running on port ${PORT}`)
});

