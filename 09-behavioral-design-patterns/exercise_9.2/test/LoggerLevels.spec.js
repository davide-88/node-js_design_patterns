import { describe, it } from 'mocha'
import chai from 'chai'
import { LoggerLevels } from '../src/LoggerLevels.js'

const assert = chai.assert

describe('LoggerLevels', () => {
  const loggerLevels = [
    {
      level: 0,
      description: 'DEBUG',
      fieldName: 'DEBUG'
    },
    {
      level: 1000,
      description: 'INFO',
      fieldName: 'INFO'
    },
    {
      level: 2000,
      description: 'WARN',
      fieldName: 'WARN'
    },
    {
      level: 3000,
      description: 'ERROR',
      fieldName: 'ERROR'
    }
  ]
  loggerLevels.forEach((loggerLevel) => {
    describe(`#${loggerLevel.fieldName}`, () => {
      it(`should have level ${loggerLevel.level}, description ${loggerLevel.description}`, () => {
        assert.equal(
          LoggerLevels[loggerLevel.fieldName].level,
          loggerLevel.level
        )
      })
    })
  })
})
