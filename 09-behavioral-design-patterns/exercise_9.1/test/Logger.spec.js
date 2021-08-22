import { describe, it, beforeEach } from 'mocha'
import { assert } from 'chai'
import sinon from 'sinon'
import { newLogger } from '../src/Logger.js'
import { LoggerLevels } from '../src/LoggerLevels.js'
import { consoleStrategy, ConsoleStrategy } from '../src/ConsoleStrategy.js'

describe('Logger', () => {
  const testCases = [
    {
      method: 'debug',
      loggerLevel: LoggerLevels.DEBUG,
      expectedNumberOfCalls: 1
    },
    {
      method: 'info',
      loggerLevel: LoggerLevels.DEBUG,
      expectedNumberOfCalls: 1
    },
    {
      method: 'warn',
      loggerLevel: LoggerLevels.DEBUG,
      expectedNumberOfCalls: 1
    },
    {
      method: 'error',
      loggerLevel: LoggerLevels.DEBUG,
      expectedNumberOfCalls: 1
    },
    {
      method: 'debug',
      loggerLevel: LoggerLevels.INFO,
      expectedNumberOfCalls: 0
    },
    {
      method: 'info',
      loggerLevel: LoggerLevels.INFO,
      expectedNumberOfCalls: 1
    },
    {
      method: 'warn',
      loggerLevel: LoggerLevels.INFO,
      expectedNumberOfCalls: 1
    },
    {
      method: 'error',
      loggerLevel: LoggerLevels.INFO,
      expectedNumberOfCalls: 1
    },
    {
      method: 'debug',
      loggerLevel: LoggerLevels.WARN,
      expectedNumberOfCalls: 0
    },
    {
      method: 'info',
      loggerLevel: LoggerLevels.WARN,
      expectedNumberOfCalls: 0
    },
    {
      method: 'warn',
      loggerLevel: LoggerLevels.WARN,
      expectedNumberOfCalls: 1
    },
    {
      method: 'error',
      loggerLevel: LoggerLevels.WARN,
      expectedNumberOfCalls: 1
    },
    {
      method: 'debug',
      loggerLevel: LoggerLevels.ERROR,
      expectedNumberOfCalls: 0
    },
    {
      method: 'info',
      loggerLevel: LoggerLevels.ERROR,
      expectedNumberOfCalls: 0
    },
    {
      method: 'warn',
      loggerLevel: LoggerLevels.ERROR,
      expectedNumberOfCalls: 0
    },
    {
      method: 'error',
      loggerLevel: LoggerLevels.ERROR,
      expectedNumberOfCalls: 1
    }
  ]

  testCases.forEach(testCase => {
    describe(`given logger level is set to ${testCase.loggerLevel.description}`, () => {
      describe(`#${testCase.method}`, () => {
        let writeStrategy
        let logger
        beforeEach(() => {
          writeStrategy = {
            write: sinon.fake()
          }
          logger = newLogger({
            level: testCase.loggerLevel,
            writeStrategy
          })
        })
        const msg = 'test message'
        const testMessages = [
          null,
          [null],
          [null, null],
          [msg],
          [msg, msg]
        ]
        testMessages.forEach(testMessage => {
          const message = testMessage
            ? testMessage.map(message => !message ? 'null' : message).join(' ')
            : null
          it(`should log "${message}"`, () => {
            if (testMessage) { logger[testCase.method](...testMessage) } else { logger[testCase.method](testMessage) }
            assert.equal(writeStrategy.write.callCount, 1)
            if (testCase.expectedNumberOfCalls > 0) {
              const args = writeStrategy.write.args
              if (testMessage) { assert.deepEqual(...args, testMessage) } else { assert.deepEqual(...args, [testMessage]) }
            }
          })
        })
      })
    })
  })

  const options = [
    null,
    {},
    { level: LoggerLevels.INFO },
    { writeStrategy: consoleStrategy() }
  ]
  options.forEach(opt => {
    describe(`given input options ${JSON.stringify(opt)}`, () => {
      const logger = newLogger(opt)
      describe('#level', () => {
        it(`should be ${LoggerLevels.INFO.description}`, () => {
          assert.equal(logger.level, LoggerLevels.INFO)
        })
      })
      describe('#strategy', () => {
        it(`should be ${ConsoleStrategy.name}`, () => {
          assert.instanceOf(logger.writeStrategy, ConsoleStrategy)
        })
      })
    })
  })

  const invalidOptionsTestCase = [
    {
      expectedMessage: 'Invalid input options: level must be an object having level and description property',
      options: { level: null }
    },
    {
      expectedMessage: 'Invalid input options: level must be an object having level and description property',
      options: { level: 'invalid level' }
    },
    {
      expectedMessage: 'Invalid input options: writeStrategy must be an object having write method',
      options: { writeStrategy: null }
    },

    {
      expectedMessage: 'Invalid input options: writeStrategy must be an object having write method',
      options: { writeStrategy: {} }
    }
  ]
  describe('given an invalid input options', () => {
    invalidOptionsTestCase.forEach(testCase => {
      it(`should throw ${testCase.expectedMessage}`, () => {
        assert.throws(() => newLogger(testCase.options), testCase.expectedMessage)
      })
    })
  })
})
