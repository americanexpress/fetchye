import deepEqual from 'deep-equal';
import { trimQueryBody } from '../src/trimQueryBody';

jest.mock('deep-equal', () => jest.fn());

describe('trimQueryBody', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should return empty object if __args are different', () => {
    deepEqual.mockImplementationOnce(() => false);
    const newQuery = {
      __args: { a: 1 },
    };
    const existingQuery = {
      __args: { a: 2 },
    };
    const result = trimQueryBody(newQuery, existingQuery);
    expect(result).toEqual({});
  });
  it('should return empty object if __name are different', () => {
    deepEqual.mockImplementationOnce(() => false);
    const newQuery = {
      __name: 'a',
    };
    const existingQuery = {
      __name: 'b',
    };
    const result = trimQueryBody(newQuery, existingQuery);
    expect(result).toEqual({});
  });
  it('should return empty object if key is not in existingQuery', () => {
    deepEqual.mockImplementationOnce(() => true);
    const newQuery = {
      a: 1,
    };
    const existingQuery = {};
    const result = trimQueryBody(newQuery, existingQuery);
    expect(result).toEqual({ a: 1 });
  });
  it('should return query if args are different', () => {
    deepEqual.mockImplementationOnce(() => false);
    const newQuery = {
      a: {
        __args: { a: 1 },
      },
    };
    const existingQuery = {
      a: {
        __args: { a: 2 },
      },
    };
    const result = trimQueryBody(newQuery, existingQuery);
    expect(result).toEqual({});
  });
  it('should return query if names are different', () => {
    deepEqual.mockImplementationOnce(() => false);
    const newQuery = {
      a: {
        __name: 'a',
      },
    };
    const existingQuery = {
      a: {
        __name: 'b',
      },
    };
    const result = trimQueryBody(newQuery, existingQuery);
    expect(result).toEqual({});
  });
  it('should retrigger trimQueryBody and find a new field', () => {
    deepEqual.mockImplementation(() => true);
    const newQuery = {
      a: {
        b: {
          c: 1,
        },
      },
    };
    const existingQuery = {
      a: {
        b: {
        },
      },
    };
    const result = trimQueryBody(newQuery, existingQuery);
    expect(result).toEqual({ a: { b: { c: 1 } } });
  });
  it('should retrigger trimQueryBody and find a new field with args', () => {
    deepEqual.mockImplementation(() => true);
    const newQuery = {
      a: {
        __args: { a: 1 },
        b: {
          c: 1,
        },
      },
    };
    const existingQuery = {
      a: {
        __args: { a: 1 },
        b: {
        },
      },
    };
    const result = trimQueryBody(newQuery, existingQuery);
    expect(result).toEqual({ a: { __args: { a: 1 }, b: { c: 1 } } });
  });
  it('should retrigger trimQueryBody and find a new field with name', () => {
    deepEqual.mockImplementation(() => true);
    const newQuery = {
      a: {
        __name: 'a',
        b: {
          c: 1,
        },
      },
    };
    const existingQuery = {
      a: {
        __name: 'a',
        b: {
        },
      },
    };
    const result = trimQueryBody(newQuery, existingQuery);
    expect(result).toEqual({ a: { __name: 'a', b: { c: 1 } } });
  });
  it('should retrigger trimQueryBody and find a new field with name and args', () => {
    deepEqual.mockImplementation(() => true);
    const newQuery = {
      a: {
        __name: 'a',
        __args: { a: 1 },
        b: {
          c: 1,
        },
      },
    };
    const existingQuery = {
      a: {
        __name: 'a',
        __args: { a: 1 },
        b: {
        },
      },
    };
    const result = trimQueryBody(newQuery, existingQuery);
    expect(result).toEqual({ a: { __name: 'a', __args: { a: 1 }, b: { c: 1 } } });
  });
  it('should retrigger trimQueryBody and find a new field with name and args and other fields', () => {
    deepEqual.mockImplementation(() => true);
    const newQuery = {
      a: {
        __name: 'a',
        __args: { a: 1 },
        b: {
          c: 1,
        },
        d: 1,
      },
    };
    const existingQuery = {
      a: {
        __name: 'a',
        __args: { a: 1 },
        b: {
        },
      },
    };
    const result = trimQueryBody(newQuery, existingQuery);
    expect(result).toEqual({
      a: {
        __name: 'a', __args: { a: 1 }, b: { c: 1 }, d: 1,
      },
    });
  });
  it('should retrigger trimQueryBody and not find a new field', () => {
    deepEqual.mockImplementation(() => true);
    const newQuery = {
      a: {
        b: {
        },
      },
    };
    const existingQuery = {
      a: {
        b: {
          c: 1,
        },
      },
    };
    const result = trimQueryBody(newQuery, existingQuery);
    expect(result).toEqual({});
  });
});
