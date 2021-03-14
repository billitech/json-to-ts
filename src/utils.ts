export function getNameFromFilePath(filepath: string) {
  return filepath.replace(/^.*(\\|\/|\:)/, '').split('.')[0]
}

function isBuiltInType(type: string): boolean {
  return ['number', 'string', 'array', 'object'].includes(type)
}

export function toCamelCase(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\s(.)/g, function ($1) {
      return $1.toUpperCase()
    })
    .replace(/\s/g, '')
    .replace(/^(.)/, function ($1) {
      return $1.toLowerCase()
    })
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
  if (typeof value == 'number') {
    return 'number'
  }

  if (Array.isArray(value)) {
    return 'array'
  }

  if (Array.isArray(value)) {
    return 'array'
  }

  if (value !== null && typeof value === 'object') {
    return 'object'
  }

  if (typeof value == 'string') {
    if (value.startsWith(tag + '[]')) {
      value = value.substring(tag.length + 2)
      if (isBuiltInType(value)) {
        return `${value}[]`
      }
      value = toCamelCase(value)

      importsMap.set(
        capitalize(value),
        `import {${capitalize(value)}} from './${toSnakeCase(value)}'`
      )
      return `${capitalize(value)}[]`
    }

    if (value.startsWith(tag)) {
      value = value.substring(tag.length)
      if (isBuiltInType(value)) {
        return `${value}`
      }
      value = toCamelCase(value)
      importsMap.set(
        capitalize(value),
        `import {${capitalize(value)}} from './${toSnakeCase(value)}'`
      )
      return capitalize(value)
    }

    return 'string'
  }

  return 'string'
}
