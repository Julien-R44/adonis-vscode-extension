/**
 * Used by edge linker
 * Find all the views that are being used inside an Edge template
 */
export const edgeRegex = new RegExp(
  /(?<=@include\(['\"]|@layout\(['\"]|@!?component\(['\"])([^'">]+)/,
  'g'
)

/**
 * Used by inertia linker and suggester
 */
export const inertiaRegex = new RegExp(/inertia\.render\(['"](.*)['"]/, 'g')
export const inertiaCompletionRegex = new RegExp(/(?<=inertia\.render\()(['"])[^'"]*\1/, 'g')

/**
 * Used by edge linker
 * Find all components as tags
 */
export const edgeComponentsAsTagsRegex = new RegExp(
  /@!?(?!include|set|unless|!component|if|elseif|inject|vite|entryPointScripts|entryPointStyles|each|click|section|layout|component|slot|!section)(.+)?\(/,
  'g'
)

/**
 * Used by edge suggester
 * Check if we are currently inside a view link and capture the user input
 */
export const viewsCompletionRegex = new RegExp(
  /(?<=[@include|@component|@layout|@!component]\()(['"])[^'"]*\1/,
  'g'
)

/**
 * Used by edge linker
 * Find all components as tags
 */
export const edgeComponentsAsTagsCompletionRegex = new RegExp(
  /@!?(?!include|set|unless|!component|each|section|layout|component)(.+?)?\(?/,
  'g'
)

/**
 * Used by view linker
 * Find all the views that are being used inside a TS code
 */
export const tsRegex = new RegExp(/[Vv]iew\.render(?:Sync)?\(['"](.*)['"]/, 'g')

/**
 * Used by view suggester
 * Check if we are currently inside a view link and capture the user input
 */
export const tsViewsCompletionRegex = new RegExp(/(?<=[Vv]iew\.render\()(['"])[^'"]*\1/, 'g')

/**
 * Used by controller suggester
 * Check if we are currently inside a controller link and capture the user input
 */
export const controllerNameCompletionRegex = new RegExp(
  /(?<=[Rr]outer?\.[a-zA-Z]*\(['"][^'"]*['"]\s*,\s*)(['"])([^\.'"]*)\1/,
  'g'
)

/**
 * Used  by controller suggester
 * Check if we are currently inside a controller method link and capture the user input
 */
export const controllerMethodCompletionRegex = new RegExp(
  /(?<=[Rr]outer?\.[a-zA-Z]*\(['"][^'"]*['"]\s*,\s*)(['"])([^'"]*)\.([^'"]*)\1/,
  'g'
)

/**
 * Used by controller linker
 * Find all controllers magic string that are being used inside a TS code
 */
export const controllersRegex = new RegExp(
  /(?<=[Rr]outer?\.[a-zA-Z]*\(['"][^'"]*['"]\s*,\s*)(['"])([^'"]*)\.?([^'"]*)\1/,
  'g'
)
