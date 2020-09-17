<h1 align="center">
  <img src="https://github.com/americanexpress/fetchye/raw/main/fetchye.png" alt="Fetchye - One Amex" width="50%" />
</h1>

> If you know how to use Fetch, you know how to use Fetchye \[fetch-yae\]. Simple React Hooks, Centralized Cache, Infinitely Extensible.

```js
// ...
import { useFetchye } from 'fetchye';

const MyComponent = () => {
  const { isLoading, data } = useFetchye('http://example.com/api/profile');
  return (
    <>
      {!isLoading && (
        <p>{data.body.name}</p>
      )}
    </>
  );
};
```

## 📖 Table of Contents

* [Features](#-features)
* [Install & Setup](#%EF%B8%8F-install--setup)
* [Usage](#-usage)
* [API](#%EF%B8%8F-api)
* [Mission](#-mission)

## ✨ Features

* ES6 Fetch powered by React Hooks
* Pure React or Redux Shared Cache modes available
* Headless per-Hook Cache Mode available
* SSR-friendly

## ⬇️ Install & Setup

**Contents**
* [Quick Install](#quick-install)
* [FetchyeProvider Install](#fetchyeprovider-install)
* [FetchyeReduxProvider Install](#fetchyereduxprovider-install)
* [One App Install](#one-app-install)

### Quick Install

>💡 Makes use of Headless per-Hook Cache Mode

**Pros**
- Painless and Quick

**Cons**
- No shared caching
- No de-duplication of API calls

Just install and do `useFetchye`. Thats it!

```sh
npm i -S fetchye
```

```js
// ...
import { useFetchye } from 'fetchye';

const MyComponent = () => {
  const { isLoading, data } = useFetchye('http://example.com/api/profile');
  return (
    <>
      {!isLoading && (
        <p>{data?.body.name}</p>
      )}
    </>
  );
};
```

🏖️[Try this out on Codesandbox](https://codesandbox.io/s/americanexpressfetchye-quick-install-w4ne2)

### `FetchyeProvider` Install

>💡 When you want a central cache but no extra dependencies

**Pros**
- Easy
- Shared Cache
- De-duplication of API calls

**Cons**
- No Redux Dev Tools for debugging and cache inspection
- Limited centralized server-side data hydration support

Install `fetchye`:

```
npm i -S fetchye
```

Add the `<FetchyeProvider />` component:

```jsx
import { FetchyeProvider } from 'fetchye';

const ParentComponent = ({ children }) => (
  <>
    <FetchyeProvider>
      {/* Use your Router to supply children components containing useFetchye */}
      {children}
    </FetchyeProvider>
  </>
);
```

In a child React Component, do `useFetchye` queries:

```js
// ...
import { useFetchye } from 'fetchye';

const MyComponent = () => {
  const { isLoading, data } = useFetchye('http://example.com/api/profile');
  return (
    <>
      {!isLoading && (
        <p>{data?.body.name}</p>
      )}
    </>
  );
};
```

🏖️[Try this out on Codesandbox](https://codesandbox.io/s/americanexpressfetchye-fetchye-provider-install-y7d8j)

### `FetchyeReduxProvider` Install

>💡 When you want a central cache integrated with a Redux based project

**Pros**
- Easy if you know Redux
- Shared Cache
- De-duplication of API calls
- Redux Dev Tools for debugging and cache inspection
- Excellent centralized server-side data hydration support

**Cons**
- More steps and dependencies

Add `fetchye` and its needed optional dependencies:

```
npm i -S fetchye redux react-redux
```

Add the `<FetchyeReduxProvider />` component under the Redux `<Provider />`:

```jsx
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { FetchyeReduxProvider } from 'fetchye/lib/FetchyeReduxProvider';
import { SimpleCache } from 'fetchye/lib/cache';

const fetchyeCache = SimpleCache({
  // Need to tell Fetchye where the cache reducer will be located
  cacheSelector: (state) => state,
});
const store = createStore(fetchyeCache.reducer);

const ParentComponent = ({ children }) => (
  <>
    <Provider store={store}>
      <FetchyeReduxProvider cache={fetchyeCache}>
        {/* Use your Router to supply children components containing useFetchye */}
        {children}
      </FetchyeReduxProvider>
    </Provider>
  </>
);
```

In a child React Component, do `useFetchye` queries:

```js
// ...
import { useFetchye } from 'fetchye';

const MyComponent = () => {
  const { isLoading, data } = useFetchye('http://example.com/api/profile');
  return (
    <>
      {!isLoading && (
        <p>{data.body.name}</p>
      )}
    </>
  );
};
```

🏖️[Try this out on Codesandbox](https://codesandbox.io/s/americanexpressfetchye-fetchye-redux-provider-install-4d2uz)

### One App Install

>💡 For when you use the [One App](https://github.com/americanexpress/one-app) Micro-Frontend Framework

**Pros**
- Shared Cache
- De-duplication of API calls
- Redux Dev Tools for debugging and cache inspection
- Excellent centralized server-side data hydration support
- Shared Cache between Micro Frontend Holocron Modules
- Immutable Redux State

**Cons**
- More steps and dependencies

```
npm i -S fetchye redux react-redux immutable redux-immutable
```

Add the `<FetchyeReduxProvider />` component to your Root Holocron Module:

```jsx
// ...
import { combineReducers } from 'redux-immutable';
import { FetchyeReduxProvider } from 'fetchye/lib/FetchyeReduxProvider';
import ImmutableCache from 'fetchye/lib/cache/ImmutableCache';

// One App requires ImmutableJS based Cache configuration:
const fetchyeCache = ImmutableCache({
  // Need to tell Fetchye where the cache reducer will be located
  cacheSelector: (state) => state.getIn(['modules', 'my-module-root', 'fetchye']),
});

const MyModuleRoot = ({ children }) => (
  <>
    <FetchyeReduxProvider cache={fetchyeCache}>
      {/* Use your Router to supply children components containing useFetchye */}
      {children}
    </FetchyeReduxProvider>
  </>
);

// ...

MyModuleRoot.holocron = {
  name: 'my-module-root',
  reducer: combineReducers({
    // ... any other reducers
    fetchye: fetchyeCache.reducer,
  }),
};
```

In a child React Component or Holocron Module, do `useFetchye` queries:

```js
// ...
import { useFetchye } from 'fetchye';

const MyComponent = () => {
  const { isLoading, data } = useFetchye('http://example.com/api/profile');
  return (
    <>
      {!isLoading && (
        <p>{data?.body.name}</p>
      )}
    </>
  );
};
```

## 🤹‍ Usage

### Real-World Example

```jsx
import React from 'react';
import { useFetchye } from 'fetchye';

const BookList = ({ genre }) => {
  const { isLoading, data } = useFetchye(`http://example.com/api/books/?genre=${genre}`, {
    headers: {
      'X-Some-Tracer-Id': 1234,
    },
  });

  if (isLoading) {
    return (<p>Loading...</p>);
  }

  return (
    <>
      {data.status === 200 && (
        <>
          <h1>Books by {genre}</h1>
          <ul>
            {data.body.map((book) => (
              <li key={book.id}>{book.title} by {book.author}</li>
            ))}
          </ul>
        </>
      )}
      {data.status !== 200 && (
        <p>Oops!</p>
      )}
    </>
  );
};
```

### Deferred execution

When you need to delay execution of a `useFetchye` call, you may use 
`{ defer: true }` option. This is great for forms:

```jsx
import React from 'react';
import { useFetchye } from 'fetchye';

const NewBookForm = () => {
  const { formData, onChange } = useSomeFormHandler();
  const { isLoading, run } = useFetchye('http://example.com/api/books', {
    // include defer here
    defer: true,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...formData,
    }),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    const { data, error } = await run();
    // Check to make sure data.status === 200 for success
  };

  return (
    <form onSubmit={onSubmit}>
      <>
        {/* ...form elements using onChange */}
      </>
      {/* Hide Submit button when sending POST request */}
      {!isLoading && <button type="submit">Submit</button>}
    </form>
  );
};
```

### Sequential API Execution

```jsx
import React from 'react';
import { useFetchye } from 'fetchye';

const MyFavoriteBook = () => {
  const { isLoading: loadingProfile, data: profile } = useFetchye('http://example.com/api/profile');
  const { isLoading: loadingBook, data: favoriteBook } = useFetchye(() => `http://example.com/api/books/${profile.body.favoriteBookId}`);

  if (loadingProfile) {
    return (<p>Loading...</p>);
  }
  if (profile.status !== 200) {
    return (<p>Oops!</p>);
  }
  if (loadingBook) {
    return (<p>Loading...</p>);
  }

  return (
    <>
      {favoriteBook.status === 200 && (
        <>
          <h1>My Favorite Book</h1>
          <h2>{favoriteBook.body.title}</h2>
        </>
      )}
      {favoriteBook.status !== 200 && (
        <p>Oops!</p>
      )}
    </>
  );
};
```

### Refreshing

```jsx
import React from 'react';
import { useFetchye } from 'fetchye';

const BookList = ({ genre }) => {
  const { isLoading, data: booksData, run } = useFetchye(`http://example.com/api/books/?genre=${genre}`);

  if (isLoading) {
    return (<p>Loading...</p>);
  }

  return (
    <>
      {/* Render booksData */}
      <button type="button" onClick={() => run()}>Refresh</button>
    </>
  );
};
```

### Custom Fetcher

Custom fetchers allow for creating reusable data fetching logic for specific
APIs or custom needs. They allow for a centrally provided
`fetchClient` which wraps that client on a per `useFetchye` request basis.

```jsx
import React from 'react';
import { useFetchye } from 'fetchye';

const graphqlFetcher = async (fetchClient, key, options) => {
  let res;
  let payload;
  let error;
  try {
    res = await fetchClient('https://example.com/graphql', {
      ...options,
      method: 'POST',
      headers: {
        'X-Correlation-Id': 12345,
        'Content-Type': 'application/json',
      },
      // The key contains the GraphQL object request rather than a URL in this case
      body: JSON.stringify(key),
    });
    // GraphQL Response
    const { data, errors } = await res.json();
    // Pass through GraphQL Data
    payload = {
      data,
      ok: res.ok,
      status: res.status,
    };
    // Assign GraphQL errors to error
    error = errors;
  } catch (requestError) {
    // eslint-disable-next-line no-console
    console.error(requestError);
    error = requestError;
  }
  return {
    payload,
    error,
  };
};

const BookList = ({ genre }) => {
  const { isLoading, data: booksData, run } = useFetchye({
    query: `
      query BookList($genre: Genre) {
        book(genre: $genre) {
          title
          author
        }
      }
      `,
    variables: { genre },
  }, {}, graphqlFetcher);

  if (isLoading) {
    return (<p>Loading...</p>);
  }

  return (
    <>
      {/* Render booksData */}
      <button type="button" onClick={() => run()}>Refresh</button>
    </>
  );
};
```

### SSR

#### One App SSR

```jsx
import React from 'react';
import ImmutableCache from 'fetchye/lib/cache/ImmutableCache';
import { useFetchye, makeServerFetchye } from 'fetchye';

const BookList = () => {
  const { isLoading, data } = useFetchye('http://example.com/api/books/');

  if (isLoading) {
    return (<p>Loading...</p>);
  }

  return (
    <>
      {/* Render data */}
    </>
  );
};

BookList.holocron = {
  loadModuleData: async ({ store: { dispatch, getState }, fetchClient }) => {
    if (global.BROWSER) {
      return;
    }
    const fetchye = makeServerFetchye({
      // Redux store
      store: { dispatch, getState },
      // Use ImmutableCache as One App uses ImmutableJS
      cache: ImmutableCache({
        // Selector to wherever fetchye reducer exists in Redux
        cacheSelector: (state) => state.getIn(['modules', 'my-module-root', 'fetchye']),
      }),
      fetchClient,
    });

    // async/await fetchye has same arguments as useFetchye
    // dispatches events into the server side Redux store
    await fetchye('http://example.com/api/books/');
  },
};

export default BookList;
```

#### Next.JS SSR

```jsx
import SimpleCache from 'fetchye/lib/cache/SimpleCache';
import { useFetchye, makeServerFetchye } from 'fetchye';

const cache = SimpleCache();

// Codesandbox takes a second to get Next.JS started...
export default function IndexPage({ initialBookList }) {
  const { isLoading, data } = useFetchye('http://example.com/api/books/', {
    initialData: initialBookList,
  });

  if (isLoading) {
    return (<p>Loading...</p>);
  }

  return (
    <>
      {/* Render data */}
    </>
  );
}

const fetchye = makeServerFetchye({
  cache,
  fetchClient: fetch,
});

export async function getServerSideProps() {
  try {
    // returns { data, error } payload for feeding initialData on client side
    const res = await fetchye('http://example.com/api/books/');
    return {
      props: {
        initialBookList: res,
      },
    };
  } catch (error) {
    console.error(error.message);
    return {};
  }
}
```

🏖️[Try this out on Codesandbox](https://codesandbox.io/s/americanexpressfetchye-fetchye-ssr-0ktx9)

## Write your own Cache

> 💬 **Note**: This is for advanced users with special cases. Advanced users should understand Redux design pattern concepts about [Reducers](https://redux.js.org/basics/reducers) and [Actions](https://redux.js.org/basics/actions) before continuing.

Sometimes, the basic opinions of the cache may not be enough for a project's use case. We can create a very basic new Cache configuration like so:

```js
import {
  IS_LOADING,
  SET_DATA,
  DELETE_DATA,
  ERROR,
  CLEAR_ERROR,
} from 'fetchye/lib/cache/constants';

export function CustomCache({ cacheSelector = (state) => state }) {
  return {
    // The reducer will save each action to state by hash key
    reducer: (state, action) => {
      switch (action.type) {
        case IS_LOADING: {
          // return is loading state change
          return state;
        }
        case SET_DATA: {
          // return set data state change
          return state;
        }
        case DELETE_DATA: {
          // return delete data state change
          return state;
        }
        case ERROR: {
          // return error state change
          return state;
        }
        case CLEAR_ERROR: {
          // return clear error state change
          return state;
        }
        default: {
          return state;
        }
      }
    },
    getCacheByKey: (state, key) => ({
      data, // dig into state and return data by key hash value
      error, // dig into state and return error by key hash value
      loading, // dig into state and return loading by key hash value
    }),
    cacheSelector, // pass through optional cacheSelector property
  };
}
```

Next we may add this to one of the Fetchye Providers and we are done:

```jsx
import { FetchyeProvider } from 'fetchye';
import { CustomCache } from './CustomCache';

const ParentComponent = ({ children }) => (
  <>
    <FetchyeProvider cache={CustomCache()}>
      {children}
    </FetchyeProvider>
  </>
);
```

> 💡 Check out [Actions API docs](#actions) and [`SimpleCache.js`](./src/cache/SimpleCache.js) source file. These will give you insights into the actions used in the reducer and practical examples on a working Cache configuration.

## 🎛️ API

**Contents**
* [`useFetchye`](#usefetchye)
* [`makeServerFetchye`](#makeserverfetchye)
* [Providers](#providers)
  * [`FetchyeProvider`](#fetchyeprovider)
  * [`FetchyeReduxProvider`](#fetchyereduxprovider)
* [Caches](#caches)
  * [`SimpleCache`](#simplecache)
  * [`ImmutableCache`](#immutablecache)
* [Actions](#actions)
  * [`IS_LOADING`](#is_loading)
  * [`SET_DATA`](#set_data)
  * [`DELETE_DATA`](#delete_data)
  * [`ERROR`](#error)
  * [`CLEAR_ERROR`](#clear_error)

### `useFetchye`

A React Hook used for dispatching asynchronous API requests.

**Shape**

```
const { isLoading, data, error, run } = useFetchye(key, { defer: Boolean, mapOptionsToKey: options => options, ...fetchOptions }, fetcher);
```

**Arguments**

| name | type | required | description |
|---|---|---|---|
| `key` | `String` or `() => String` | `true` | A string or function returning a string that factors into cache key creation. *Defaults to URL compatible string*. |
| `options` | `Object<Options>` | `false` | Options to pass through to ES6 Fetch. See **Options** table for the exceptions to this rule. The `options` object factors into cache key creation. |
| `fetcher` | `async (fetchClient: Fetch, key: String, options: Options) => ({ payload: Object, error?: Object })` | `false` | The async function that calls `fetchClient` by key and options. Returns a `payload` with outcome of `fetchClient` and an optional `error` object. |

**Options**

| name | type | required | description |
|---|---|---|---|
| `mapOptionsToKey` | `(options: Options) => transformedOptions` | `false` | A function that maps options to the key that will become part of the cache key |
| `defer` | `Boolean` | `false` | Prevents execution of `useFetchye` on each render in favor of using the returned `run` function. *Defaults to `false`* |
| `initialData` | `Object` | `false` | Seeds the initial data on first render of `useFetchye` to accomodate server side rendering *Defaults to `undefined`* |
| `...restOptions` | `ES6FetchOptions` | `true` | Contains any ES6 Compatible `fetch` option. (See [Fetch Options](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Supplying_request_options)) |

**Returns**

| name | type | description |
|---|---|---|
| `isLoading` | `Boolean` | A boolean to indicate whether in loading state or not. |
| `data` | `Object` | A result of a `fetchClient` query. *Defaults to returning `{ status, body, ok, headers }` from `fetchClient` response* |
| `error?` | `Object` | An object containing an error if present. *Defaults to an `Error` object with a thrown `fetch` error. This is not for API errors (e.g. Status 500 or 400). See `data` for that* |
| `run` | `async () => {}` | A function for bypassing the cache and firing an API call. This will cause `isLoading === true` and update the cache based on the result. |

### `makeServerFetchye`

A factory function used to generate an async/await fetchye function used for server-side API calls.

**Shape**

```
const fetchye = makeServerFetchye({ cache, fetchClient });

const { data, error } = await fetchye(key, options, fetcher);
```

**`makeServerFetchye` Arguments**

| name | type | required | description |
|---|---|---|---|
| `cache` | `Cache` | `true` | Fetchye `Cache` object. |
| `fetchClient` | `ES6Fetch` | `true` | A [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) compatible function. |

**`fetchye` Arguments**

| name | type | required | description |
|---|---|---|---|
| `key` | `String` or `() => String` | `true` | A string or function returning a string that factors into cache key creation. *Defaults to URL compatible string*. |
| `options` | `ES6FetchOptions` | `false` | Options to pass through to [ES6 Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). |
| `fetcher` | `async (fetchClient: Fetch, key: String, options: Options) => ({ payload: Object, error?: Object })` | `false` | The async function that calls `fetchClient` by key and options. Returns a `payload` with outcome of `fetchClient` and an optional `error` object. |

**`fetchye` Returns**

| name | type | description |
|---|---|---|
| `data` | `Object` | A result of a `fetchClient` query. *Defaults to returning `{ status, body, ok, headers }` from `fetchClient` response* |
| `error?` | `Object` | An object containing an error if present. *Defaults to an `Error` object with a thrown `fetch` error. This is not for API errors (e.g. Status 500 or 400). See `data` for that* |

### Providers

A Provider creates a React Context to connect all the `useFetchye` Hooks into a centrally stored cache.

#### `FetchyeProvider`

A React Context Provider that holds the centralized cache for all the `useFetchye` React Hooks' query data. This Provider uses `useReducer` for cache storage.

**Shape**

```
<FetchyeProvider cache={SimpleCache()}>
  {children}
</FetchyeProvider>
```

**Props**

| name | type | required | description |
|---|---|---|---|
| `fetchClient` | `ES6Fetch` | `true` | A [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) compatible function. |
| `cache` | `Cache` | `false` | Fetchye `Cache` object. *Defaults to `SimpleCache`* |
| `initialData` | `Object` | `false` | Initial state to feed into Cache Configuration `reducer` |

#### `FetchyeReduxProvider`

> 💡Requires additional `redux` and `react-redux` packages installed

A React Context Provider that uses Redux to store the centralized cache for all the `useFetchye` React Hooks' query data. 

**Shape**

```
import { FetchyeReduxProvider } from "fetchye/lib/FetchyeReduxProvider";
```

```
<Provider>
  <FetchyeReduxProvider cache={SimpleCache()}>
    {children}
  </FetchyeReduxProvider>
</Provider>
```

**Context**

| name | type | required | description |
|---|---|---|---|
| `ReactReduxContext` | `ReactReduxContext` | `true` | A [Redux Context](https://react-redux.js.org/api/provider) from a `<Provider />`. |

**Props**

| name | type | required | description |
|---|---|---|---|
| `fetchClient` | `ES6Fetch` | `true` | A [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) compatible function. |
| `cache` | `Cache` | `false` | Fetchye `Cache` object. *Defaults to `SimpleCache`* |

### Caches

A factory function that returns a configuration object, used to instruct a Provider on how to store and retrieve fetchye cache data.

#### `SimpleCache`

This Cache configuration relies on plain old Javascript data structures to back the `reducer` and `getCacheByKey` functions.

**Shape**

```
import SimpleCache from 'fetchye/lib/cache/SimpleCache';

const cache = SimpleCache({
  cacheSelector
});
```

**Arguments**

| name | type | required | description |
|---|---|---|---|
| `cacheSelector` | `(state) => state` | `false` | *Required if using `FetchyeReduxProvider`* A function that returns the location inside Redux State to the Fetchye Cache. (See [Redux Selectors](https://redux.js.org/recipes/computing-derived-data)). |

**Returns**

| name | type | description |
|---|---|---|
| `reducer` | `(state, action) => state` | A function that reduces the next state of Fetchye Cache. (See [Redux Reducers](https://redux.js.org/basics/reducers)). |
| `getCacheByKey` | `(cache, key) => state` | A function that returns a minimum of `{ data, loading, error }` for a specific cache key from cache state. |
| `cacheSelector?` | `(state) => state` | An optionally returned parameter. This function returns the location inside Redux State to the Fetchye Cache. (See [Redux Selectors](https://redux.js.org/recipes/computing-derived-data)). |

#### `ImmutableCache`

> 💡Requires additional `immutable` package installed

This Cache configuration relies on ImmutableJS data structures to back the `reducer` and `getCacheByKey` functions.

**Shape**

```
import ImmutableCache from 'fetchye/lib/cache/ImmutableCache';

const cache = ImmutableCache({
  cacheSelector
});
```

**Arguments**

| name | type | required | description |
|---|---|---|--|
| `cacheSelector` | `(state) => state` | `false` | *Required if using `FetchyeReduxProvider`* A function that returns the location inside Redux State to the Fetchye Cache. (See [Redux Selectors](https://redux.js.org/recipes/computing-derived-data)). |

**Returns**

| name | type | description |
|---|---|---|
| `reducer` | `(state, action) => state` | A function that reduces the next state of Fetchye Cache. (See [Redux Reducers](https://redux.js.org/basics/reducers)). |
| `getCacheByKey` | `(cache = Immutable.Map(), key) => state` | A function that returns a minimum of `{ data, loading, error }` for a specific cache key from cache state. |
| `cacheSelector?` | `(state) => state` | An optionally returned parameter. This function returns the location inside Redux State to the Fetchye Cache. (See [Redux Selectors](https://redux.js.org/recipes/computing-derived-data)). |

### Actions

These actions power the state transitions described in a Cache Configuration `reducer` function.

#### `IS_LOADING`

An event signaling a state transition to the loading state
by hash key.

**Shape**

```
import { IS_LOADING } from 'fetchye/lib/cache/constants';
```

```
{
  type: IS_LOADING,
  hash,
}
```

**Child Properties**

| name | type | description |
|---|---|---|
| `hash` | `String` | The hash value generated by [`object-hash`](https://github.com/puleos/object-hash) package for the query |

#### `SET_DATA`

An event signaling a state transition inside a reducer to add or replace the data
field and transition away from loading state by hash key.

**Shape**

```
import { SET_DATA } from 'fetchye/lib/cache/constants';
```

```
{
  type: SET_DATA,
  hash,
  value,
}
```

**Child Properties**

| name | type | description |
|---|---|---|
| `hash` | `String` | The hash value generated by [`object-hash`](https://github.com/puleos/object-hash) package for the query |
| `value` | `Object` | Contains the `payload` data returned from the `fetcher` inside `useFetchye` |

#### `DELETE_DATA`

An event signaling a state transition inside a reducer to remove the data field by hash key.

**Shape**

```
import { DELETE_DATA } from 'fetchye/lib/cache/constants';
```

```
{
  type: DELETE_DATA,
  hash,
}
```

**Child Properties**

| name | type | description |
|---|---|---|
| `hash` | `String` | The hash value generated by [`object-hash`](https://github.com/puleos/object-hash) package for the query |

#### `ERROR`

An event signaling a state transition inside a reducer to insert an error and transition away from loading state by hash key.

**Shape**

```
import { ERROR } from 'fetchye/lib/cache/constants';
```

```
{
  type: ERROR,
  hash,
  error,
}
```

**Child Properties**

| name | type | description |
|---|---|---|
| `hash` | `String` | The hash value generated by [`object-hash`](https://github.com/puleos/object-hash) package for the query |
| `error` | `Error | String | null` | Contains the `error` value returned from the `fetcher` inside `useFetchye` |

#### `CLEAR_ERROR`

An event signaling a state transition inside a reducer to remove an error by hash key.

**Shape**

```
import { CLEAR_ERROR } from 'fetchye/lib/cache/constants';
```

```
{
  type: CLEAR_ERROR,
  hash,
}
```

**Child Properties**

| name | type | description |
|---|---|---|
| `hash` | `String` | The hash value generated by [`object-hash`](https://github.com/puleos/object-hash) package for the query |

## 📢 Mission

The Fetchye project wishes to bring a more flexible central caching experience
using the best ideas of the Redux design pattern and options for the developer
to choose how their data is stored. Fetchye provides React Context driven
caching options backed by your choice of pure React (via `useReducer`) or Redux.
Unlike many data fetching solutions, Fetchye Context Providers do not rely on
singleton statics and can be instantiated throughout an application multiple
times for multiple caches if so desired. 

## 🏆 Contributing

We welcome Your interest in the American Express Open Source Community on Github.
Any Contributor to any Open Source Project managed by the American Express Open
Source Community must accept and sign an Agreement indicating agreement to the
terms below. Except for the rights granted in this Agreement to American Express
and to recipients of software distributed by American Express, You reserve all
right, title, and interest, if any, in and to Your Contributions. Please [fill
out the Agreement](https://cla-assistant.io/americanexpress/fetchye).

Please feel free to open pull requests and see [CONTRIBUTING.md](./CONTRIBUTING.md) to learn how to get started contributing.

## 🗝️ License

Any contributions made under this project will be governed by the [Apache License
2.0](./LICENSE.txt).

## 🗣️ Code of Conduct

This project adheres to the [American Express Community Guidelines](./CODE_OF_CONDUCT.md).
By participating, you are expected to honor these guidelines.