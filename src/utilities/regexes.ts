/**
 * Used by inertia linker and suggester
 */
export const inertiaRegex = new RegExp(/inertia\.render\(["'](.*)["']/, 'g')
export const inertiaCompletionRegex = new RegExp(/(?<=inertia\.render\()(["'])[^"']*\1/, 'g')

/**
 * Used by controller suggester
 * Check if we are currently inside a controller link and capture the user input
 */
export const controllerNameCompletionRegex = new RegExp(
  /(?<=[Rr]outer?\.[A-Za-z]*\(["'][^"']*["']\s*,\s*)(["'])([^"'.]*)\1/,
  'g'
)

/**
 * Used  by controller suggester
 * Check if we are currently inside a controller method link and capture the user input
 */
export const controllerMethodCompletionRegex = new RegExp(
  /(?<=[Rr]outer?\.[A-Za-z]*\(["'][^"']*["']\s*,\s*)(["'])([^"']*)\.([^"']*)\1/,
  'g'
)

/**
 * Used by controller linker
 * Find all controllers magic string that are being used inside a TS code
 */
export const controllersRegex = new RegExp(
  /(?<=[Rr]outer?\.[A-Za-z]*\(["'][^"']*["']\s*,\s*)(["'])([^"']*)\.?([^"']*)\1/,
  'g'
)
