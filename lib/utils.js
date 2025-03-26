import {app} from 'electron'
import path from 'path'

export const getBaseDir = () => {
  const appPath = app.getAppPath()

  if (path.extname(appPath) === '.asar') {
    return path.resolve(appPath, '..', '..')
  }

  return appPath
}
