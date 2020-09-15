import { defaultEqualityChecker } from '../src/defaultEqualityChecker';

const fakeSliceOfState = {
  loading: true,
  data: { fake: 'data' },
  error: new Error('stuff'),
};

describe('defaultEqualityChecker', () => {
  it('should return true when a and b are equal', () => {
    expect(defaultEqualityChecker(fakeSliceOfState, fakeSliceOfState)).toEqual(true);
  });
  it('should return false when a.error and b.error arent equal', () => {
    const b = {
      ...fakeSliceOfState,
      error: new Error('changed'),
    };
    expect(defaultEqualityChecker(fakeSliceOfState, b)).toEqual(false);
  });
  it('should return false when a.data and b.data arent equal', () => {
    const b = {
      ...fakeSliceOfState,
      data: { fake: 'new data' },
    };
    expect(defaultEqualityChecker(fakeSliceOfState, b)).toEqual(false);
  });
  it('should return false when a.loading and b.loading arent equal', () => {
    const b = {
      ...fakeSliceOfState,
      loading: false,
    };
    expect(defaultEqualityChecker(fakeSliceOfState, b)).toEqual(false);
  });
});
