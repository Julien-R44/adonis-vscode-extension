import { Notifier } from '../../notifier'
import { ArgType } from '../../../types/projects/v5'
import BaseCommand from '../../commands/base_command'
import type { AdonisProject } from '../../../types/projects'
import type { CommandEntry } from '../../../types/projects/v6'

/**
 * Generic class to run custom commands
 */
export class RunCustomCommand extends BaseCommand {
  /**
   * Ask the user for a command argument value
   */
  private static async askForArgumentValue(arg: CommandEntry['args'][number]) {
    let placeholder = `Enter the value for the argument '${arg.name || arg.argumentName}'`
    if (!arg.required) {
      placeholder += ' (optional)'
    }

    const argInput = await this.getInput(placeholder, arg.description)

    return { name: arg.argumentName, value: argInput }
  }

  /**
   * Ask the user for a flag value
   */
  private static async askForFlagValue(flag: CommandEntry['flags'][number]) {
    /**
     * Ask for boolean flag type
     */
    if (flag.type === ArgType.Boolean) {
      const flagInput = await this.getYesNo(
        `Do you want to set the flag '${flag.name || flag.flagName}' ?`
      )

      return { name: flag.name, value: flagInput }
    }

    /**
     * Ask for Strings, Number and Array flag types
     */
    const flagInput = await this.getInput(
      `Enter the value for the flag '${flag.name || flag.flagName}'`,
      flag.description
    )
    return { name: flag.flagName, value: flagInput }
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

  static async run(project: AdonisProject, command: CommandEntry) {
    /**
     * Ask for arguments
     */
    const argsResult = []
    for (const arg of command.args) {
      const argResult = await this.askForArgumentValue(arg)

      if (!argResult.value && arg.required) {
        return Notifier.showError(`You must enter a value for '${arg.name || arg.argumentName}'`)
      }

      argsResult.push(argResult)
    }

    /**
     * Ask for flags
     */
    const flagsResults = []
    for (const flag of command.flags) {
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
      command.commandName,
      argsResult,
      flagsResults
    )

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: finalCommand,
      successMessage: `'${command.commandName}' command executed successfully`,
      errorMessage: 'Failed to execute the command.',
      background,
      project,
    })
  }
}
