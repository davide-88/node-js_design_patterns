import { describe, it, beforeEach } from 'mocha'
import { assert } from 'chai'
import sinon from 'sinon'
import { LoggerLevels } from '../src/LoggerLevels.js'
import { LoggerTemplate } from '../src/LoggerTemplate.js'

describe('LoggerTemplate', () => {
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
        let logger
        beforeEach(() => {
          logger = new LoggerTemplate({
            level: testCase.loggerLevel
          })
          sinon.replace(
            logger,
            '_write',
            sinon.fake()
          )
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
            assert.equal(logger._write.callCount, 1)
            if (testCase.expectedNumberOfCalls > 0) {
              const args = logger._write.args
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
    { level: LoggerLevels.INFO }
  ]
  options.forEach(opt => {
    describe(`given input options ${JSON.stringify(opt)}`, () => {
      const logger = new LoggerTemplate()
      describe('#level', () => {
        it(`should be ${LoggerLevels.INFO.description}`, () => {
          assert.equal(logger.level, LoggerLevels.INFO)
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
    }
  ]
  describe('given an invalid input options', () => {
    invalidOptionsTestCase.forEach(testCase => {
      it(`should throw ${testCase.expectedMessage}`, () => {
        assert.throws(() => new LoggerTemplate(testCase.options), testCase.expectedMessage)
      })
    })
  })

  describe('#_write', () => {
    const message = '_write must be implemented'
    const logger = new LoggerTemplate()
    it(`should throw an error with message ${message}`, () => {
      assert.throws(() => logger._write())
    })
  })
})
