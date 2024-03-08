import * as fs from 'fs'
import { join } from 'path'
import { Extractor } from '@julr/module-methods-extractor'
import {slash} from '../utilities/index'
import type { Controller } from '../types'
import type { AdonisProject } from '../types/projects'

export function controllerMagicStringToPath(project: AdonisProject, controller: Controller) {
  let controllersDirectory = ''

  if (project.isAdonis5()) {
    controllersDirectory = 'app/Controllers/Http'
  } else if (project.isAdonis6()) {
    controllersDirectory = 'app/controllers'
  }

  const absPath = join(project.path, controllersDirectory)
  const path = `${join(absPath, controller.namespace || '', controller.name)}.ts`

  if (fs.existsSync(path)) {
    return slash(path)
  }

  return null
}

/**
 * Check if the two arrays contains the same elements. The order of the elements is not important.
 */
export function arraysEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false
  }

  for (const elem of arr1) {
    if (!arr2.includes(elem)) {
      return false
    }
  }

  return true
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Extract all the methods in a JS/TS source file. If the source file
 * doesn't exist, a null value is returned.
 *
 * @param sourcePath File path of the source file
 */
function extractMethodsInSourceFile(sourcePath: string) {
  const source = fs.readFileSync(sourcePath.replace(/file:\/\//, '')).toString('ascii')

  const extractor = new Extractor()
  return extractor.extract(source)
}

/**
 * Get all method names in a JS/TS source file.
 *
 * @param sourcePath File path of the source file
 */
export function getMethodsInSourceFile(sourcePath: string) {
  try {
    const output = extractMethodsInSourceFile(sourcePath)
    if (!output) return []

    return output.methods.map((method) => method.name)
  } catch (err) {
    return []
  }
}

/**
 * Get the line number a method is declared in a source file.
 *
 * @param methodName Method name to locate
 * @param sourcePath Source file to extract from
 */
export async function getLineNumber(
  sourcePath: string,
  methodName: string
): Promise<{ lineno: number; name: string }> {
  try {
    const notFound = { lineno: -1, name: methodName }
    const methods = extractMethodsInSourceFile(sourcePath)
    if (!methods) return notFound

    const method = methods.methods.find((_method: any) => _method.name === methodName.trim())

    return method || notFound
  } catch (err) {
    return { lineno: -1, name: methodName }
  }
}
