import {getConfig} from './config.js'

export const desktopGroupApi = async (path, payload) => {
  const {key, controller} = await getConfig()

  const response = await fetch(`${controller}/desktop-api${path}`, {
    method: 'post',
    body: JSON.stringify({
      key,
      ...payload
    })
  }).catch(() => {
    console.log(`⚠️ Unable to contact controller`)
  })

  return response
}
