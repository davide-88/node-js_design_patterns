import { StrategyType } from './StrategyType.js'

export function consoleStrategy () {
  return new ConsoleStrategy()
}

export class ConsoleStrategy extends StrategyType {
  write () {
    console.log(...arguments)
  }
}
