import { describe, beforeEach, it, afterEach } from 'mocha'
import sinon from 'sinon'
import chai from 'chai'
import { FileSystemLogger } from '../src/FileSystemLogger.js'
import fs from 'fs'
import { EOL } from 'os'

const assert = chai.assert

describe('FileSystemLogger', () => {
  describe('#_write', () => {
    let fsFake
    let writeFake
    let logger = new FileSystemLogger()
    beforeEach(() => {
      logger = new FileSystemLogger()
      writeFake = sinon.fake()
      fsFake = sinon.replace(
        fs,
        'createWriteStream',
        sinon.fake(() => ({
          write: writeFake
        }))
      )
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
        if (msg) { logger._write(...msg) } else { logger._write(msg) }
        assert.isTrue(fsFake.calledOnce, 'createWriteStream was not called')
        assert.isTrue(writeFake.calledOnce, 'write was not called')
        assert.equal(writeFake.args.length, 1)
        if (msg) { assert.deepEqual(writeFake.args[0][0], toMessage(msg) + EOL) } else { assert.deepEqual(writeFake.args[0][0], 'null' + EOL) }
      })
    })
    describe('called twice', () => {
      it('should call createWriteStream only once', () => {
        const msg = 'test'
        logger._write(msg)
        logger._write(msg)
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
