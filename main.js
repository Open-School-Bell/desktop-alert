import {app, BrowserWindow, Menu, Tray, dialog} from 'electron'
import path from 'path'

import {getConfig} from './lib/config.js'

let tray = null
let config = null

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(process.cwd(), 'resources', 'logo.png'),
    title: 'OSB Desktop Alert'
  })

  win.removeMenu()
  win.loadFile('resources/alert.html')
}

app.whenReady().then(async () => {
  config = await getConfig()

  console.dir(config)

  tray = new Tray(path.join(process.cwd(), 'resources', 'logo.png'))
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
