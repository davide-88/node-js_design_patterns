import { describe, it, beforeEach } from 'mocha'
import { assert } from 'chai'
import { createFSAdapter } from '../src/fs-adapter.js'

describe('createFSAdapter', () => {
  let fsAdapter

  beforeEach(() => {
    fsAdapter = createFSAdapter()
  })

  it('should return a FS adapter', () => {
    const fsAdapterProps = ['readFile', 'writeFile']
    assert.hasAllKeys(fsAdapter, fsAdapterProps)
    fsAdapterProps.forEach(prop => {
      assert.isFunction(fsAdapter[prop])
    })
  })

  describe('#radFile', () => {
    describe('given a path to a non-existing file', () => {
      it('should call the provided callback passing an error having code ENOENT', (done) => {
        const filename = 'non-existing-file.txt'
        fsAdapter.readFile(filename, err => {
          assert.equal(err.code, 'ENOENT')
          assert.equal(err.message, `ENOENT, open "${filename}"`)
          done()
        })
      })
    })
    describe('given an existing file', () => {
      const filename = 'file.txt'
      const fileContent = 'test text'
      beforeEach((done) => {
        fsAdapter.writeFile(filename, fileContent, () => {
          done()
        })
      })

      it('should read file in memory', (done) => {
        fsAdapter.readFile(filename, (err, val) => {
          if (err) {
            console.error(err)
          }
          assert.equal(val, fileContent)
          done()
        })
      })
    })
  })

  describe('#writeFile', () => {
    describe('given a valid filename', () => {
      it('should write file in memory', (done) => {
        const contents = 'test text'
        const filename = 'file.txt'
        fsAdapter.writeFile(filename, contents, (err, obj) => {
          if (err) {
            console.error(err)
          }
          assert.equal(obj.contents, contents)
          assert.equal(obj.filename, filename)
          done()
        })
      })
    })

    describe('given an invalid filename', () => {
      it('should call the callback passing the exception as first param', (done) => {
        fsAdapter.writeFile(null, 'will not be written', (err) => {
          assert.isNotNull(err)
          done()
        })
      })
    })
  })
})
