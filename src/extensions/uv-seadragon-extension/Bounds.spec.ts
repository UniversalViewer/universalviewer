import {  } from 'Jest';

import { Bounds } from './Bounds';

describe('Bounds', () => {
  const bounds = new Bounds(0, 5, 100, 95);

  it('has accessors available', () => {
    expect(bounds.x).toEqual(0);
    expect(bounds.y).toEqual(5);
    expect(bounds.w).toEqual(100);
    expect(bounds.h).toEqual(95);
  });
  describe('toString', () => {
    it('is in format x,y,w,h', () => {
      expect(bounds.toString()).toEqual('0,5,100,95');
    });
  });
  describe('fromString', () => {
    it('creates with arguments in correct order', () => {
      expect(Bounds.fromString(bounds.toString()).toString()).toEqual(bounds.toString());
    });
  });
});
