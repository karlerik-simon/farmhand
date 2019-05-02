import React from 'react';
import { PlantableItems } from './PlantableItems';
import Item from '../Item';
import { shallow } from 'enzyme';

jest.mock('../../data/maps');
jest.mock('../../data/items');

let component;

const getPlantableItems = (props = {}) => (
  <PlantableItems
    {...{
      handlers: {
        handleItemSelect: () => {},
        ...props.handlers,
      },
      state: {
        plantableInventory: [],
        selectedItemId: '',
        ...props.state,
      },
    }}
  />
);

beforeEach(() => {
  component = shallow(getPlantableItems());
});

describe('rendering', () => {
  beforeEach(() => {
    component = shallow(
      getPlantableItems({
        state: {
          plantableInventory: [{ quantity: 1, id: 'sample-crop-3' }],
          selectedItemId: 'sample-crop-3',
        },
      })
    );
  });

  test('renders items for provided inventory', () => {
    expect(component.find(Item)).toHaveLength(1);
  });

  test('renders selected item state', () => {
    expect(component.find(Item).props().isSelected).toBeTruthy();
  });
});
