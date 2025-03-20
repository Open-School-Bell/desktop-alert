import fs from 'fs'
import path from 'path'

const {readFile} = fs.promises

export const getConfig = async () => {
  const content = await readFile(path.join(process.cwd(), 'desktop-alert.json'))

  const config = JSON.parse(content.toString())

  return config
}