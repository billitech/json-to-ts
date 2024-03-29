import { capitalize, getType } from './utils'
import camelCase from "lodash.camelcase"

export function jsonToInterface(json: Object, name: string) {
  const nameCapitalize = capitalize(camelCase(name))
  const importsMap = new Map<string, string>()
  const attrArray = new Array<string>()

  for (const [key, value] of Object.entries(json)) {
    if (value === null) {
      if (key.endsWith('?')) {
        attrArray.push(`readonly ${key}: string`)
      } else {
        attrArray.push(`readonly ${key}?: string`)
      }
    } else {
      const type = getType(value, importsMap)
      attrArray.push(`readonly ${key}: ${type}`)
    }
  }

  let outputString = ''

  importsMap.forEach((imp, key) => {
    if (key != nameCapitalize) {
      outputString += imp + '\n'
    }
  })

  if (outputString.length > 0) {
    outputString += '\n'
  }

  outputString += `export interface ${nameCapitalize} { \n`

  attrArray.forEach((attr) => {
    outputString += `  ${attr}\n`
  })

  outputString += '}'

  return [nameCapitalize, outputString]
}
