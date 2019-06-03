import fs from 'fs'
import schedule from 'node-schedule'
import moment from 'moment'
import { getWind, getTemp, getRH } from './getGrib'

function isFileExist(field, date, format) {
  return new Promise((resolve, reject) => {
    fs.access(`data/${field}/${field}-${format}-${date}.${format}`, fs.constants.F_OK, (err) => {
      if (!err) {
        resolve(true)
      } else {
        resolve(date)
      }
    });
  })
}

export function checkFile(field, format = "json") {
  let dateArr = []
  for (let i = 0; i < 9; i++) { // NCEP只能下载最近9天的天气
    const date = moment().subtract(i, 'days').format("YYYYMMDD")
    dateArr.push(date)
  }
  const promises = dateArr.map((date) => {
    return isFileExist(field, date, format)
  })
  return new Promise((allResolve, allReject) => {
    Promise.all(promises)
      .then(results => {
        allResolve(results.filter(item => item !== true))
      })
      .catch(err => {
        allReject(err)
      })
  })
}



export function createSchedule(time = { hour: 5, minute: 30, second: 0 }) {
  schedule.scheduleJob(time, async () => {
    const missingDateArr = await checkFile("wind")
    const missingTempDateArr = await checkFile("temp")
    console.log(missingDateArr)
    console.log(missingTempDateArr)
    const promises = missingDateArr.map(date => {
      return getWind(date)
    })
    const promisesTemp = missingTempDateArr.map(date => {
      return getTemp(date)
    })

    await Promise.all(promises)
      .then((results) => {
        // console.log(results)
      })
    await Promise.all(promisesTemp)
      .then((results) => {
        // console.log(results)
      })
  })
}