import oneFetchye from '../src/oneFetchye';

const mockOneCacheSymbol = Symbol('oneCache');
jest.mock('../src/OneCache', () => jest.fn(() => mockOneCacheSymbol));
jest.mock('fetchye', () => ({
  makeServerFetchye: jest.fn((...makeFetchyeArgs) => jest.fn((...fetcheArgs) => Promise.resolve(
    { makeFetchyeArgs, fetcheArgs }
  ))),
}));
describe('oneFetchye', () => {
  const originalWindow = global.window;

  afterEach(() => {
    global.window = originalWindow;
  });

  it('should return a one-app-thunk that calls fetchye', async () => {
    expect.assertions(1);
    const fetchyeParams = [Symbol('fetchyeArgs 1'), Symbol('fetchyeArgs 2')];
    const fetchyeThunk = oneFetchye(...fetchyeParams);
    const thunkParams = [Symbol('dispatch'), Symbol('getState'), Symbol('fetchClient')];
    const response = await fetchyeThunk(
      thunkParams[0], thunkParams[1], { fetchClient: thunkParams[2] }
    );
    expect(response).toStrictEqual({
      fetcheArgs: fetchyeParams,
      makeFetchyeArgs: [
        {
          cache: mockOneCacheSymbol,
          fetchClient: thunkParams[2],
          promiseStore: undefined,
          store: {
            dispatch: thunkParams[0],
            getState: thunkParams[1],
          },
        },
      ],
    });
  });

  it('should give fetchye a promise store to deduplicate requests on the server', async () => {
    expect.assertions(1);
    Object.defineProperty(global, 'window', {
      value: undefined,
      configurable: true,
      writable: true,
    });
    const fetchyeThunk = oneFetchye(Symbol('fetchyeArgs 1'));
    const response = await fetchyeThunk(
      jest.fn(), jest.fn(), { fetchClient: Symbol('fetchClient') }
    );
    expect(response.makeFetchyeArgs[0].promiseStore).toStrictEqual({
      getLocalPromise: expect.any(Function),
      storeLocalPromise: expect.any(Function),
    });
  });
});
