import { moneyString } from '../utils'

export default [
  {
    id: 'plant-crop',
    name: 'Plant a crop',
    description: 'Purchase a seed and plant it in the field.',
    rewardDescription: moneyString(150),
    condition: () => {},
    reward: () => {},
  },
  {
    id: 'water-crop',
    name: 'Water a crop',
    description: 'Water a crop that you planted.',
    rewardDescription: moneyString(150),
    condition: () => {},
    reward: () => {},
  },
  {
    id: 'harvest-crop',
    name: 'Harvest a crop',
    description: 'Harvest a crop that you planted',
    rewardDescription: moneyString(300),
    condition: () => {},
    reward: () => {},
  },
]
