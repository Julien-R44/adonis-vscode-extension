import ProjectManager from '../../services/adonis_project/manager'
import { Notifier } from '../../services/notifier'
import BaseCommand from '../base_command'
import { ArgType } from '../../services/adonis_project/contracts'
import type { Arg } from '../../services/adonis_project/contracts'
import type { AdonisProject } from '../../services/adonis_project'

/**
 * Generic class to run custom commands
 */
export class RunCustomCommand extends BaseCommand {
  /**
   * Pick a project
   */
  private static async pickProject(project?: AdonisProject) {
    let selectedProject = project

    if (!selectedProject) {
      selectedProject = await ProjectManager.quickPickProject(
        'Select an Adonis Project on which you want to run the custom command'
      )
    }

    return selectedProject
  }

  /**
   * Ask user to pick a custom command to run
   */
  private static async pickCommand(project: AdonisProject) {
    const customCommands = project.getCustomAceCommands()
    const commandInput = await this.getListInput(
      'Select the command to run',
      customCommands.map((command) => command.name),
      false
    )

    return customCommands.find((command) => command.name === commandInput[0])
  }

  /**
   * Ask the user for a command argument value
   */
  private static async askForArgumentValue(arg: Arg & { required: boolean }) {
    let placeholder = `Enter the value for the argument '${arg.name || arg.propertyName}'`
    if (!arg.required) {
      placeholder += ' (optional)'
    }

    const argInput = await this.getInput(placeholder, arg.description)

    return { name: arg.propertyName, value: argInput }
  }

  /**
   * Ask the user for a flag value
   */
  private static async askForFlagValue(flag: Arg) {
    /**
     * Ask for boolean flag type
     */
    if (flag.type === ArgType.Boolean) {
      const flagInput = await this.getYesNo(
        `Do you want to set the flag '${flag.name || flag.propertyName}' ?`
      )

      return { name: flag.name, value: flagInput }
    }

    /**
     * Ask for Strings, Number and Array flag types
     */
    const flagInput = await this.getInput(
      `Enter the value for the flag '${flag.name || flag.propertyName}'`,
      flag.description
    )
    return { name: flag.propertyName, value: flagInput }
  }

  /**
   * Build the final command to pass to the terminal
   */
  private static buildFinalCommand(
    commandName: string,
    argsResult: { name: string; value: string }[],
    flagsResults: { name: string; value: boolean | string }[]
  ) {
    const args = argsResult.map(({ value }) => `"${value}"`).join(' ')
    const flags = flagsResults
      .map((flag) => {
        const { name, value } = flag

        // If no value, we just don't pass the flag
        if (!value) {
          return ''
        }

        // If value is boolean, we just pass the flag
        if (value === true) {
          return `--${name}`
        }

        // If value is string, we pass the flag with the value
        return `--${name}="${value}"`
      })
      .join(' ')

    return `${commandName} ${args} ${flags}`
  }

  public static async run(preSelectedProject?: AdonisProject) {
    const project = await this.pickProject(preSelectedProject)
    if (!project) {
      return Notifier.showError('You must select a project.')
    }

    const command = await this.pickCommand(project)
    if (!command) {
      return Notifier.showError('You must select a command.')
    }

    /**
     * Ask for arguments
     */
    const argsResult = []
    for (const arg of command.command.args) {
      const argResult = await this.askForArgumentValue(arg)

      if (!argResult.value && arg.required) {
        return Notifier.showError(`You must enter a value for '${arg.name || arg.propertyName}'`)
      }

      argsResult.push(argResult)
    }

    /**
     * Ask for flags
     */
    const flagsResults = []
    for (const flag of command.command.flags) {
      const flagResult = await this.askForFlagValue(flag)
      flagsResults.push(flagResult)
    }

    /**
     * Should we run in background
     */
    const background = await this.getYesNo('Do you want to run the command in background?')

    /**
     * Build the final command to pass to the terminal
     */
    const finalCommand = RunCustomCommand.buildFinalCommand(
      command.command.commandName,
      argsResult,
      flagsResults
    )

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: finalCommand,
      successMessage: `'${command.name}' command executed successfully`,
      errorMessage: 'Failed to execute the command.',
      background,
    })
  }
}
