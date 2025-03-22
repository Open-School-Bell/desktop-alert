import fs from 'fs'
import path from 'path'
import {mkdirp} from 'mkdirp'
import {finished} from 'stream/promises'
import {Readable} from 'stream'
import {asyncForEach} from '@arcath/utils'

import {desktopGroupApi} from './desktop-group-api.js'

const {readFile, writeFile} = fs.promises

export const getConfig = async () => {
  const content = await readFile(path.join(process.cwd(), 'desktop-alert.json'))

  const config = JSON.parse(content.toString())

  return config
}

export const updateConfig = async () => {
  const {controller, key} = await getConfig()

  const response = await desktopGroupApi('/get-config')

  if (!response) return

  const result = await response.json()

  const content = JSON.stringify({...result, controller, key}, null, ' ')

  await writeFile(path.join(process.cwd(), 'desktop-alert.json'), content)

  const soundsResponse = await desktopGroupApi('/get-audio', {})

  if (!soundsResponse) return

  const sounds = await soundsResponse.json()

  await mkdirp(path.join(process.cwd(), 'sounds'))

  await asyncForEach(sounds, async ({fileName}) => {
    const downloadResponse = await fetch(
      `${controller}/sounds/${fileName}`
    ).catch(() => log(`⚠️ Unable to download sound ${fileName}`))

    if (!downloadResponse) return

    const downloadStream = fs.createWriteStream(
      path.join(process.cwd(), 'sounds', fileName)
    )
    await finished(Readable.fromWeb(downloadResponse.body).pipe(downloadStream))
  })
}
