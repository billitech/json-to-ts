#!/usr/bin/env node

const yargs = require('yargs')
const fs = require('fs')
const fg = require('fast-glob')
const chalk = require('chalk')
const jsonToInterface = require('../dist')
const boxen = require('boxen')
const path = require('path')

const getJsonFilesStreams = (jsonsPath) => {
  if (jsonsPath.substr(-1) !== '/' && jsonsPath.substr(-1) !== '\\') {
    jsonsPath += path.sep
  }

  return fg.stream([jsonsPath + '*.json'], {
    dot: false,
    deep: 0,
    absolute: true,
    onlyFiles: true,
  })
}

const processFromFilesStream = async (stream, dist) => {
  fs.mkdirSync(dist, { recursive: true })
  if (dist.substr(-1) !== '/' && dist.substr(-1) !== '\\') {
    dist += path.sep
  }
  for await (let entry of stream) {
    if (entry instanceof Buffer) {
      entry = entry.toString()
    }

    const json = require(entry)
    const name = jsonToInterface.getNameFromFilePath(entry)
    const model = jsonToInterface.jsonToInterface(json, name)
    fs.writeFileSync(`${dist}${jsonToInterface.toSnakeCase(name)}.ts`, model)

    // @ts-ignore
    console.log(chalk.default(`Processed file: ${chalk.green(entry)}`))
  }

  console.log(
    boxen('done!', {
      padding: {
        left: 20,
        right: 20,
        top: 1,
        bottom: 1,
      },
      float: 'center',
      margin: 1,
    })
  )
}

yargs(process.argv.slice(2))
  .command(
    'build [path] [dest]',
    'Convert json files to typescript interfaces',
    (yargs) => {
      let defaultSrc = process.cwd() + path.sep + 'jsons'
      let defaultDist = process.cwd() + path.sep + 'src' + path.sep + 'models'
      try {
        if (fs.existsSync(process.cwd() + path.sep + 'json-to-ts.json')) {
          const config = require(process.cwd() + path.sep + 'json-to-ts.json')
          defaultSrc = config.src
          defaultDist = config.dist
        }
      } catch (err) {
        console.error(err)
      }

      yargs.positional('src', {
        describe: 'path to the json files',
        default: defaultSrc,
      })

      yargs.positional('dist', {
        describe: 'path for the generated files',
        default: defaultDist,
      })
    },
    (argv) => {
      const stream = getJsonFilesStreams(argv.src)
      processFromFilesStream(stream, argv.dist)
    }
  )
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  })
  .demandCommand(1).argv
