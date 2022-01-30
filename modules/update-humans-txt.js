import path from 'path'
import fs from 'fs'
import consola from 'consola'

const logger = consola.withScope('nuxt:update-humans-txt')
const lastBuildTime = new Date().toISOString().split('T')[0]

export default function () {
  const self = this

  const humansTxtDistPath = path.join(
    self.nuxt.options.generate.dir,
    'humans.txt'
  )

  self.nuxt.hook('builder:prepared', (nuxt) => {
    const { content: websiteUrl } = nuxt.options.head.meta.find(
      (meta) => meta.hid === 'url'
    )

    nuxt.options.head.link.push({
      rel: 'author',
      type: 'text/plain',
      href: `${websiteUrl}/humans.txt`,
    })

    logger.success('Injected link to `humans.txt` into head')
  })

  self.nuxt.hook('generate:done', () => {
    if (!fs.existsSync(humansTxtDistPath))
      return logger.error(
        "No `humans.txt` was found, won't inject last update time"
      )

    fs.appendFileSync(humansTxtDistPath, `\n\tLast update: ${lastBuildTime}`)

    logger.success('Injected last update time into `humans.txt`')
  })
}
