/* eslint-disable no-undef */
import { coloredConsole } from '../src/ColoredConsole.js'
import { assert } from 'chai'
import sinon from 'sinon'
import styles from 'ansi-styles'

describe('coloredConsole', () => {
  let consoleFake
  let colorConsole
  beforeEach(() => {
    consoleFake = sinon.replace(
      console,
      'log',
      sinon.fake(() => {})
    )
    colorConsole = coloredConsole(console)
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should be a new object', () => {
    assert.notEqual(colorConsole, console)
  })

  Object.keys(console).forEach(key => {
    it(`should have ${key} console property`, () => {
      assert.equal(colorConsole[key], console[key])
    })
  })

  const testContexts = [{
    method: 'red',
    color: {
      open: styles.color.red.open,
      close: styles.color.red.close
    }
  }, {
    method: 'yellow',
    color: {
      open: styles.color.yellow.open,
      close: styles.color.yellow.close
    }
  }, {
    method: 'green',
    color: {
      open: styles.color.green.open,
      close: styles.color.green.close
    }
  }]

  testContexts.forEach(testContext => {
    describe(`#${testContext.method}`, () => {
      it('should be a function', () => {
        assert.isFunction(colorConsole[testContext.method])
      })
      const testCases = [null, [null], ['msg'], [null, null], ['array', 'messages']]

      testCases.forEach(messages => {
        it(`should print ${messages && messages.map(msg => msg || 'null').join(' ')} ${testContext.method}`, () => {
          if (messages) {
            colorConsole[testContext.method](...messages)
          } else {
            colorConsole[testContext.method](messages)
          }
          const firstCallArgs = consoleFake.firstCall.args
          const expectedNumberOfArgs = messages ? messages.length + 2 : 3
          assert.equal(firstCallArgs.length, expectedNumberOfArgs)
          assert.equal(firstCallArgs[0], testContext.color.open)
          if (messages) {
            messages.forEach((msg, i) => {
              assert.equal(msg, firstCallArgs[i + 1])
            })
          } else {
            assert.isNull(firstCallArgs[1])
          }
          assert.equal(firstCallArgs[expectedNumberOfArgs - 1], testContext.color.close)
        })
      })
    })
  })
})
