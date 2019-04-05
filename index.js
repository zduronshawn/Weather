import Koa from "koa"
import { createSchedule, checkFile } from './utils/schedule'
import routers from './route'

const app = new Koa();

const PORT = 3000

// checkFile("wind")
createSchedule({
  hour: 12,
  minute: 8,
  second: 0
})

app.use(routers.routes()).use(routers.allowedMethods())

app.listen(3000, () => {
  console.log(`server running on port ${PORT}`)
});

