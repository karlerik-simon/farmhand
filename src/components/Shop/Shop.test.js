import React from 'react';
import { Shop } from './Shop';
import Inventory from '../Inventory';
import { shallow } from 'enzyme';

let component;

const getShop = (props = {}) => (
  <Shop
    {...{
      handlers: { handleFieldPurchase: () => {}, ...props.handlers },
      items: [],
      state: {
        purchasedField: 0,
        money: 0,
        valueAdjustments: {},
        ...props.state,
      },
      ...props.options,
    }}
  />
);

beforeEach(() => {
  component = shallow(getShop());
});

test('renders shop inventory', () => {
  expect(component.find(Inventory)).toHaveLength(1);
});
