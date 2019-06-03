import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'
import request from 'superagent'
import moment from 'moment';
/*
  https://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl
  ?file=gfs.t00z.pgrb2.1p00.f000
  &lev_10_m_above_ground=on
  &var_UGRD=on
  &var_VGRD=on
  &dir=%2Fgfs.2019032600
  */
const ORIGIN = "https://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl"
// const GRIB_DIR = "/gfs.2019032600" 
const GRIB_FILE = "gfs.t00z.pgrb2.1p00.f000" //file
const VAR_TRUE = "on" // means this varible is selected

function pipeGrib(stream, path) {
  return new Promise((resolve, reject) => {
    console.time(`${path} downloading`)
    stream.pipe(fs.createWriteStream(path))
    stream.on('end', () => {
      console.timeEnd(`${path} downloading`)
      resolve()
    })
    stream.on('error', () => {
      console.error(`downloading${path} grib fail`)
      reject()
    })
  })
}

export async function getWind(date) {
  if (!date) date = moment().format("YYYYMMDD")
  const qs = {
    file: GRIB_FILE,
    dir: `/gfs.${date}00`,
    lev_10_m_above_ground: VAR_TRUE,
    var_UGRD: VAR_TRUE,
    var_VGRD: VAR_TRUE
  }
  const path = `data/wind/wind-grib-${date}`
  const resp = request.get(ORIGIN).query(qs)
  const reulst = await pipeGrib(resp, path)
  console.time(`${path} grib2json`)
  await exec(`grib2json -d -n -o data/wind/wind-json-${date}.json ${path}`)
  console.timeEnd(`${path} grib2json`)
  // fs.unlink(path, (err) => {
  //   if (err) throw err
  //   console.log(`${path} grib deleted`)
  // })
}

export async function getTemp(date) {
  if (!date) date = moment().format("YYYYMMDD")
  const qs = {
    file: GRIB_FILE,
    dir: `/gfs.${date}00`,
    lev_surface: VAR_TRUE,
    var_TMP: VAR_TRUE,
  }
  const path = `data/temp/temp-grib-${date}`
  const resp = request.get(ORIGIN).query(qs)
  const reulst = await pipeGrib(resp, path)
  console.time(`${path} grib2json`)
  await exec(`grib2json -d -n -o data/temp/temp-json-${date}.json ${path}`)
  console.timeEnd(`${path} grib2json`)
  // fs.unlink(path, (err) => {
  //   if (err) throw err
  //   console.log(`${path} grib deleted`)
  // })
}