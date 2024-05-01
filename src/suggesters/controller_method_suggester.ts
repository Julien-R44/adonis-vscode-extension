import type { AdonisProject } from '../types/projects'
import { getMethodsInSourceFile } from '../utilities/misc'
import { ControllerSuggester } from './controller_suggester'

export class ControllerMethodSuggester {
  static async getControllerMethodSuggestions(options: { project: AdonisProject; text: string }) {
    const text = options.text.replaceAll(/"|'/g, '').replaceAll(/\s/g, '')
    const [controller, method] = text.split('.')

    const controllers = await ControllerSuggester.geControllerSuggestions({
      project: options.project,
      text: controller!,
    })

    if (!controllers.length) return []

    const foundController = controllers[0]!
    const methods = getMethodsInSourceFile(foundController.filePath)

    return methods
      .filter((m) => {
        if (!method) return true
        return m.startsWith(method)
      })
      .map((method) => ({
        text: method,
        description: 'Controller method',
        documentation: '',
        filePath: foundController.filePath,
        detail: '',
      }))
  }
}
