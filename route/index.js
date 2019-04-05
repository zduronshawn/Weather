import Router from 'koa-router'
import path from 'path'
import fs from 'fs'
// import mimes from '../utils/mimes'

let router = new Router()

function file(filePath) {
  let content = fs.readFileSync(filePath, 'binary')
  return content
}

router.get("/wind/:date", async (ctx, next) => {
  const date = ctx.params.date
  const windPath = `data/wind/wind-json-${date}.json`
  let content = ""
  try {
    fs.accessSync(windPath, fs.constants.F_OK)
    content = await file(windPath)
    ctx.body = content
    ctx.type = ""
  } catch (err) {
    ctx.body = {
      code: -1,
      msg: "file not find"
    }
    console.log(err)
  }
})

export default router