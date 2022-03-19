import camelCase from "lodash.camelcase"

export function getNameFromFilePath(filepath: string) {
  return filepath.replace(/^.*(\\|\/|\:)/, '').split('.')[0]
}

function isBuiltInType(type: string): boolean {
  return ['number', 'string', 'unknown[]', 'boolean', 'unknown'].includes(
    type
  )
}

export function toSnakeCase(value: string) {
  return value
    .split('')
    .map((character) => {
      if (character == character.toUpperCase() && character != '_') {
        return '_' + character.toLowerCase()
      } else {
        return character
      }
    })
    .join('')
}

export function toFileCase(value: string) {
  return value
    .split('')
    .map((character) => {
      if (
        character == character.toUpperCase() &&
        character != '-' &&
        character != '_'
      ) {
        return '-' + character.toLowerCase()
      } else if (character == '_') {
        return '-'
      } else {
        return character
      }
    })
    .join('')
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getType(
  value: any,
  importsMap: Map<string, string>,
  tag: string = '$'
): string {
  if (typeof value == 'boolean') {
    return 'boolean'
  }
  if (typeof value == 'number') {
    return 'number'
  }

  if (Array.isArray(value)) {
    return 'unknown[]'
  }

  if (value !== null && typeof value === 'object') {
    return 'unknown'
  }

  if (typeof value == 'string') {
    if (value.startsWith(tag + '[]')) {
      value = value.substring(tag.length + 2)
      if (isBuiltInType(value)) {
        return `${value}[]`
      }
      value = camelCase(value)

      importsMap.set(
        capitalize(value),
        `import {${capitalize(value)}} from './${toFileCase(value)}'`
      )
      return `${capitalize(value)}[]`
    }

    if (value.startsWith(tag)) {
      value = value.substring(tag.length)
      if (isBuiltInType(value)) {
        return `${value}`
      }
      value = camelCase(value)
      importsMap.set(
        capitalize(value),
        `import {${capitalize(value)}} from './${toFileCase(value)}'`
      )
      return capitalize(value)
    }

    return 'string'
  }

  return 'string'
}
