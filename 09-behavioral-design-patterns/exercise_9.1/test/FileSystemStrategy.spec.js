import { describe, beforeEach, it, afterEach } from 'mocha'
import sinon from 'sinon'
import chai from 'chai'
import { fileSystemStrategy } from '../src/FileSystemStrategy.js'
import fs from 'fs'
import { EOL } from 'os'

const assert = chai.assert

describe('FileSystemStrategy', () => {
  describe('#write', () => {
    let fsFake = {}
    let writeFake = {}
    let strategy = fileSystemStrategy()
    beforeEach(() => {
      writeFake = sinon.fake()
      fsFake = sinon.replace(
        fs,
        'createWriteStream',
        sinon.fake(() => ({
          write: writeFake
        }))
      )
      strategy = fileSystemStrategy()
    })

    afterEach(() => {
      sinon.restore()
    })
    const messages = [
      null,
      [null],
      [null, null],
      ['test message'],
      ['first', 'second'],
      [{ key: 'value' }]
    ]
    messages.forEach(msg => {
      it(`should write on file system ${toMessage(msg)}`, () => {
        if (msg) { strategy.write(...msg) } else { strategy.write(msg) }
        assert.isTrue(fsFake.calledOnce, 'createWriteStream was not called')
        assert.isTrue(writeFake.calledOnce, 'write was not called')
        assert.equal(writeFake.args.length, 1)
        if (msg) { assert.deepEqual(writeFake.args[0][0], toMessage(msg) + EOL) } else { assert.deepEqual(writeFake.args[0][0], 'null' + EOL) }
      })
    })
    describe('called twice', () => {
      it('should call createWriteStream only once', () => {
        const msg = 'test'
        strategy.write(msg)
        strategy.write(msg)
        assert.equal(fsFake.callCount, 1, 'createWriteStream was not called only once')
      })
    })
  })
})

function toMessage (msg) {
  return msg && msg.join
    ? msg.map(m => {
      if (m instanceof Object) {
        return JSON.stringify(m)
      }
      return m || 'null'
    }).join(' ')
    : msg
}
