import { testItem } from '../../test-utils'
import { LOAN_PAYOFF } from '../../templates'

import { sellItem } from './sellItem'

jest.mock('../../data/maps')

describe('sellItem', () => {
  test('sells item', () => {
    const state = sellItem(
      {
        inventory: [testItem({ id: 'sample-item-1', quantity: 1 })],
        itemsSold: {},
        loanBalance: 0,
        money: 100,
        pendingPeerMessages: [],
        todaysNotifications: [],
        revenue: 0,
        todaysRevenue: 0,
        valueAdjustments: { 'sample-item-1': 1 },
      },
      testItem({ id: 'sample-item-1' })
    )

    expect(state.inventory).toEqual([])
    expect(state.money).toEqual(101)
    expect(state.revenue).toEqual(1)
    expect(state.todaysRevenue).toEqual(1)
    expect(state.itemsSold).toEqual({ 'sample-item-1': 1 })
  })

  test('does not change revenue for seed sales', () => {
    const state = sellItem(
      {
        inventory: [testItem({ id: 'sample-crop-seeds-1', quantity: 1 })],
        itemsSold: {},
        loanBalance: 0,
        money: 100,
        pendingPeerMessages: [],
        todaysNotifications: [],
        revenue: 0,
        todaysRevenue: 0,
        valueAdjustments: { 'sample-crop-seeds-1': 1 },
      },
      testItem({ id: 'sample-crop-seeds-1' })
    )

    expect(state.inventory).toEqual([])
    expect(state.money).toEqual(101)
    expect(state.revenue).toEqual(0)
    expect(state.todaysRevenue).toEqual(0)
    expect(state.itemsSold).toEqual({ 'sample-crop-seeds-1': 1 })
  })

  test('applies achievement bonus to farm products', () => {
    const state = sellItem(
      {
        inventory: [testItem({ id: 'sample-item-1', quantity: 1 })],
        itemsSold: {},
        loanBalance: 0,
        money: 100,
        pendingPeerMessages: [],
        todaysNotifications: [],
        revenue: 0,
        todaysRevenue: 0,
        valueAdjustments: { 'sample-item-1': 1 },
        completedAchievements: {
          'i-am-rich-3': true,
        },
      },
      testItem({ id: 'sample-item-1' })
    )

    expect(state.inventory).toEqual([])
    expect(state.money).toEqual(101.25)
    expect(state.revenue).toEqual(1.25)
    expect(state.todaysRevenue).toEqual(1.25)
    expect(state.itemsSold).toEqual({ 'sample-item-1': 1 })
  })

  test('does not apply achievement bonus to seeds', () => {
    const state = sellItem(
      {
        inventory: [testItem({ id: 'sample-crop-seeds-1', quantity: 1 })],
        itemsSold: {},
        loanBalance: 0,
        money: 100,
        pendingPeerMessages: [],
        todaysNotifications: [],
        revenue: 0,
        todaysRevenue: 0,
        valueAdjustments: { 'sample-crop-seeds-1': 1 },
        completedAchievements: {
          'i-am-rich-3': true,
        },
      },
      testItem({ id: 'sample-crop-seeds-1' })
    )

    expect(state.inventory).toEqual([])
    expect(state.money).toEqual(101)
    expect(state.revenue).toEqual(0)
    expect(state.todaysRevenue).toEqual(0)
    expect(state.itemsSold).toEqual({ 'sample-crop-seeds-1': 1 })
  })

  test('updates learnedRecipes', () => {
    const { learnedRecipes } = sellItem(
      {
        inventory: [testItem({ id: 'sample-item-1', quantity: 3 })],
        itemsSold: {},
        loanBalance: 0,
        money: 100,
        pendingPeerMessages: [],
        todaysNotifications: [],
        revenue: 0,
        todaysRevenue: 0,
        valueAdjustments: { 'sample-item-1': 1 },
      },
      testItem({ id: 'sample-item-1' }),
      3
    )

    expect(learnedRecipes['sample-recipe-1']).toBeTruthy()
  })

  describe('there is an outstanding loan', () => {
    let state

    describe('item is not a farm product', () => {
      test('sale is not garnished', () => {
        state = sellItem(
          {
            inventory: [testItem({ id: 'sample-crop-seeds-1', quantity: 3 })],
            itemsSold: {},
            loanBalance: 100,
            money: 100,
            pendingPeerMessages: [],
            todaysNotifications: [],
            revenue: 0,
            todaysRevenue: 0,
            valueAdjustments: { 'sample-crop-seeds-1': 10 },
          },
          testItem({ id: 'sample-crop-seeds-1' }),
          3
        )

        expect(state.loanBalance).toEqual(100)
        expect(state.money).toEqual(130)
        expect(state.revenue).toEqual(0)
        expect(state.todaysRevenue).toEqual(0)
      })
    })

    describe('item is a farm product', () => {
      describe('loan is greater than garnishment', () => {
        test('sale is garnished', () => {
          state = sellItem(
            {
              inventory: [testItem({ id: 'sample-crop-1', quantity: 3 })],
              itemsSold: {},
              loanBalance: 100,
              money: 100,
              pendingPeerMessages: [],
              todaysNotifications: [],
              revenue: 0,
              todaysRevenue: 0,
              valueAdjustments: { 'sample-crop-1': 10 },
            },
            testItem({ id: 'sample-crop-1' }),
            3
          )

          expect(state.loanBalance).toEqual(97)
          expect(state.money).toEqual(157)
          expect(state.revenue).toEqual(57)
          expect(state.todaysRevenue).toEqual(57)
        })
      })

      describe('loan is less than garnishment', () => {
        beforeEach(() => {
          state = sellItem(
            {
              inventory: [testItem({ id: 'sample-crop-1', quantity: 3 })],
              itemsSold: {},
              loanBalance: 1.5,
              money: 100,
              pendingPeerMessages: [],
              todaysNotifications: [],
              revenue: 0,
              todaysRevenue: 0,
              valueAdjustments: { 'sample-crop-1': 10 },
            },
            testItem({ id: 'sample-crop-1' }),
            3
          )
        })

        test('loan is payed off', () => {
          expect(state.loanBalance).toEqual(0)
        })

        test('sale is reduced based on remaining loan balance', () => {
          expect(state.money).toEqual(158.5)
          expect(state.todaysRevenue).toEqual(58.5)
        })

        test('payoff notification is shown', () => {
          expect(state.todaysNotifications).toEqual([
            { message: LOAN_PAYOFF``, severity: 'success' },
          ])
        })
      })
    })
  })
})
