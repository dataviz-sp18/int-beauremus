const fetch = require('node-fetch')
const fs = require('fs')

const numbersToTry = [...Array(200).keys()]

async function download(value) {
  const res = await fetch(`https://gramener.com/playground/senate/kraken/${value}.jpegcopy.png`)
  await new Promise((resolve, reject) => {
    if (res.status !== 200) {
      reject(new Error('Not 200'))
      return
    }
    const fileStream = fs.createWriteStream(`./images/${value}.jpegcopy.png`)
    res.body.pipe(fileStream)
    res.body.on('error', err => {
      reject(err)
    })
    fileStream.on('finish', () => {
      resolve()
    })
  })
}

numbersToTry.forEach(value => {
  download(value).catch(console.error)
})
