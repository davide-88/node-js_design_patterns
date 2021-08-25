import { describe, it } from 'mocha'
import chai from 'chai'
import { createWarehouseItem } from '../src/WarehouseItem.js'
import { WarehouseItemStates } from '../src/WarehouseItemState.js'
import { randomUUID } from 'crypto'

const assert = chai.assert

describe('createWarehouseItem', () => {
  const options = [
    null,
    {
      state: WarehouseItemStates.ARRIVING
    },
    {
      id: randomUUID(),
      state: WarehouseItemStates.ARRIVING
    },
    {
      id: randomUUID(),
      state: WarehouseItemStates.STORED
    },
    {
      id: randomUUID(),
      state: WarehouseItemStates.DELIVERED
    },
    {
      state: null
    },
    {
      id: null
    },
    {
      id: null,
      state: null
    }
  ]
  options.forEach((opt) => {
    describe(`given input options ${JSON.stringify(opt)}`, () => {
      it('should create a WarehouseItem', () => {
        const item = createWarehouseItem(opt)
        assert.equal(item.constructor.name, 'WarehouseItem')
        if (opt && opt.id) assert.equal(item.id, opt.id)
        else assert.isNotNull(item.id)
        if (opt && opt.state) assert.equal(item.state, opt && opt.state)
        else assert.equal(item.state, WarehouseItemStates.ARRIVING, `expected ${JSON.stringify(item.state)} to equal ${JSON.stringify(WarehouseItemStates.ARRIVING)}`)
      })
    })
  })
})

describe('WarehouseItem', () => {
  const testCases = [
    {
      initialState: WarehouseItemStates.ARRIVING,
      methodToBeCalled: 'store',
      inputToMethodToBeCalled: randomUUID(),
      expected: {
        finalState: WarehouseItemStates.STORED,
        exceptionMsg: null
      }
    },
    {
      initialState: WarehouseItemStates.STORED,
      methodToBeCalled: 'store',
      inputToMethodToBeCalled: randomUUID(),
      expected: {
        finalState: null,
        exceptionMsg: `store can be invoked only if current state is ${WarehouseItemStates.ARRIVING.description}`
      }
    },
    {
      initialState: WarehouseItemStates.DELIVERED,
      methodToBeCalled: 'store',
      inputToMethodToBeCalled: randomUUID(),
      expected: {
        finalState: null,
        exceptionMsg: `store can be invoked only if current state is ${WarehouseItemStates.ARRIVING.description}`
      }
    },
    {
      initialState: WarehouseItemStates.ARRIVING,
      methodToBeCalled: 'deliver',
      inputToMethodToBeCalled: '217 Waterloo Rd, London SE1 8XH, United Kingdom',
      expected: {
        finalState: null,
        exceptionMsg: `deliver can be invoked only if current state is ${WarehouseItemStates.STORED.description}`
      }
    },
    {
      initialState: WarehouseItemStates.STORED,
      methodToBeCalled: 'deliver',
      inputToMethodToBeCalled: randomUUID(),
      expected: {
        finalState: WarehouseItemStates.DELIVERED,
        exceptionMsg: null
      }
    },
    {
      initialState: WarehouseItemStates.DELIVERED,
      methodToBeCalled: 'deliver',
      inputToMethodToBeCalled: randomUUID(),
      expected: {
        finalState: null,
        exceptionMsg: `deliver can be invoked only if current state is ${WarehouseItemStates.STORED.description}`
      }
    }
  ]
  testCases.forEach(testCase => {
    describe(`is in state ${JSON.stringify(testCase.initialState)}, calling "${testCase.methodToBeCalled}"`, () => {
      const item = createWarehouseItem({
        state: testCase.initialState
      })
      if (!testCase.expected.exceptionMsg) {
        it(`should move to state ${JSON.stringify(testCase.expected.finalState)}`, () => {
          item[testCase.methodToBeCalled](testCase.inputToMethodToBeCalled)
          assert.equal(item.state, testCase.expected.finalState,
            `expected ${JSON.stringify(item.state)} to equal ${JSON.stringify(testCase.expected.finalState)}`
          )
        })
      } else {
        it(`should throw ${testCase.expected.exceptionMsg} message`, () => {
          assert.throws(() => item[testCase.methodToBeCalled](testCase.inputToMethodToBeCalled), testCase.expected.exceptionMsg)
        })
      }
    })
  })

  const describeTestCases = [{
    id: randomUUID(),
    methodsToBeCalled: [],
    methodsToBeCalledArgs: [],
    expectedDescription: (item) => `Item ${item.id} is on its way to the warehouse`
  },
  {
    id: randomUUID(),
    methodsToBeCalled: ['store'],
    methodsToBeCalledArgs: [[randomUUID()]],
    expectedDescription: (item) => `Item ${item.id} is stored in location ${item.locationId}`
  },
  {
    id: randomUUID(),
    methodsToBeCalled: ['store', 'deliver'],
    methodsToBeCalledArgs: [[randomUUID()], ['217 Waterloo Rd, London SE1 8XH, United Kingdom']],
    expectedDescription: (item) => `Item ${item.id} was delivered to ${item.address}`
  }]
  describeTestCases.forEach(describeTestCase => {
    const item = createWarehouseItem({ id: describeTestCase.id })
    describeTestCase.methodsToBeCalled.forEach((method, index) => item[method](...describeTestCase.methodsToBeCalledArgs[index]))
    describe('#describe', () => {
      it(`should print ${describeTestCase.expectedDescription(item)}`, () => {
        assert.equal(item.describe(), describeTestCase.expectedDescription(item))
      })
    })
  })
})
