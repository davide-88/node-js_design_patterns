import { LoggerTemplate } from './LoggerTemplate.js'

export class ConsoleLogger extends LoggerTemplate {
  _write () {
    console.log(...arguments)
  }
}
