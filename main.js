import {app, BrowserWindow, Menu, Tray, dialog, ipcMain} from 'electron'
import cron from 'node-cron'
import path from 'path'
import {isAfter} from 'date-fns'

import {getConfig, updateConfig} from './lib/config.js'

let tray = null
let config = null
let win = null
let lastTriggerTime = new Date()

const createWindow = () => {
  win = new BrowserWindow({
    width: 400,
    height: 170,
    icon: path.join(import.meta.dirname, 'resources', 'logo.png'),
    title: 'OSB Desktop Alert',
    webPreferences: {
      preload: path.join(import.meta.dirname, 'lib', 'preload.js')
    }
  })

  win.removeMenu()
  win.loadFile('resources/alert.html')
}

app.whenReady().then(async () => {
  await updateConfig()

  config = await getConfig()

  tray = new Tray(path.join(import.meta.dirname, 'resources', 'logo.png'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      type: 'normal',
      click: () => {
        createWindow()
      }
    },
    {
      label: 'Quit',
      type: 'normal',
      click: async () => {
        const result = await dialog.showMessageBox(undefined, {
          message:
            'Are you sure you want to quit? You will not recieve alerts from the controller if Desktop Alert is not running.',
          title: 'Are you sure?',
          type: 'warning',
          buttons: ['Yes', 'No']
        })

        if (result.response === 0) {
          app.quit()
        }
      }
    }
  ])
  tray.setToolTip('OSB Desktop Alert')
  tray.setContextMenu(contextMenu)
})

app.on('window-all-closed', e => e.preventDefault())

ipcMain.handle('getConfig', async () => {
  return config
})

cron.schedule('*/30 * * * * *', async () => {
  await updateConfig()

  config = await getConfig()

  const playData = JSON.parse(config.playData)

  if (
    playData &&
    playData.triggerTime &&
    isAfter(new Date(playData.triggerTime), lastTriggerTime)
  ) {
    if (!win) {
      createWindow()
    }

    setTimeout(() => {
      win.webContents.send('playSound', {
        fileName: playData.fileName,
        times: playData.times
      })
    }, 1_000)
  }

  lastTriggerTime = new Date()
})
