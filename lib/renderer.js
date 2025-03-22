let config = null

document.addEventListener('DOMContentLoaded', async () => {
  config = await window.electronAPI.getConfig()

  document.querySelector('#groupName').innerHTML = config.groupName
})

window.electronAPI.onPlaySound(({fileName, times}) => {
  const player = document.querySelector('#player')
  player.src = `../sounds/${fileName}`

  let count = 0

  player.addEventListener('ended', () => {
    count++
    if (count < times) {
      player.play()
    }
  })

  player.load()
  player.play()
})
