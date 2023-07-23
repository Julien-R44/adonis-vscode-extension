import type { Controller } from '.'

export interface Position {
  line: number
  colStart: number
  colEnd: number
}

export interface RouteLink {
  controllerPath: string | null
  controller: Controller | null
  position: Position
}

export interface InertiaLink {
  templatePath: string
  position: Position
}

export interface ViewLink {
  templatePath: string
  position: Position
}
