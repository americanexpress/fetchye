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
* [Install](#%EF%B8%8F-install)
* [Usage](#-usage)
* [API](#%EF%B8%8F-api)
* [Mission](#-mission)

## ✨ Features

* ES6 Fetch powered by React Hooks
* Centralized Cache
* Redux, Headless (Coming Soon) or `useReducer` (Coming Soon) Cache modes available
* SSR-friendly

## ⬇️ Install

> For One App Installs skip to [One App Install](#one-app-install) section.

### Redux-based Install

```
npm i -S fetchye
```

Add the `<FetchyeReduxProvider />` component under the Redux `<Provider />`:

> A Standalone Provider without Redux will be added in Beta release.

```jsx
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { FetchyeReduxProvider } from 'fetchye';
import { fetchyeReducer } from 'fetchye/lib/cache/immutable/reducer';

const store = createStore(reducer);

const ParentComponent = ({ children }) => (
  <>
    <Provider store={store}>
      <FetchyeReduxProvider fetchClient={fetch} cacheSelector={(state) => state}>
        {/* Use your Router to supply children components containing useFetchye */}
        {children}
      </FetchyeReduxProvider>
    </Provider>
  </>
);
```

### One App Install

```
npm i -S fetchye
```

Add the `<FetchyeReduxProvider />` component to your Root Holocron Module:

```jsx
// ...
import { combineReducers } from 'redux-immutable';
import { FetchyeReduxProvider } from 'fetchye';
import { fetchyeReducer } from 'fetchye/lib/cache/immutable/reducer';

const MyModuleRoot = ({ children }) => (
  <>
    <FetchyeReduxProvider fetchClient={fetch} cacheSelector={(state) => state.getIn(['modules', 'my-module-root', 'fetchye'])}>
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
    fetchye: fetchyeReducer,
  }),
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

### Lazy execution

When you need to delay execution of a `useFetchye` call, you may use 
`{ lazy: true }` option. This is great for forms:

```jsx
import React from 'react';
import { useFetchye } from 'fetchye';

const NewBookForm = () => {
  const { formData, onChange } = useSomeFormHandler();
  const { isLoading, run } = useFetchye('http://example.com/api/books', {
    // include lazy here
    lazy: true,
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

### Data Dependent Execution

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

### SSR

> A non-Redux driven `makeServerFetchye` will be introduced in the Beta release

```jsx
import React from 'react';
import { useFetchye, makeServerFetchye } from 'fetchye';

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
      {/* Render data */}
    </>
  );
};

BookList.someServerSideFunc = async ({ store: { dispatch, getState } }) => {
  const fetchye = makeServerFetchye({
    // Redux store
    store: { dispatch, getState },
    fetchClient: fetch,
    // Selector to wherever fetchye reducer exists in Redux
    cacheSelector: (state) => state,
  });

  // async/await fetchye has same arguments as useFetchye
  const { data, error } = await fetchye(`http://example.com/api/books/?genre=${genre}`, {
    headers: {
      'X-Some-Tracer-Id': 1234,
    },
  });

  // Server will run a fetchye API call and cache the result.
  // Client will draw the API call result with matching arguments from the cache
  // without firing an API call.
};
```

## 🎛️ API

### `useFetchye`

**Shape**

```
const { isLoading, data, error, run } = useFetchye(key, { lazy: Boolean, mapOptionsToKey: options => options, ...fetchOptions }, fetcher);
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
| `lazy` | `Boolean` | `false` | Prevents execution of `useFetchye` on each render in favor of using the returned `run` function. *Defaults to `false`* |
| `...restOptions` | `ES6FetchOptions` | `true` | Contains any ES6 Compatible `fetch` option. (See [Fetch Options](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Supplying_request_options)) |

**Returns**

| name | type | description |
|---|---|---|
| `isLoading` | `Boolean` | A boolean to indicate whether in loading state or not. |
| `data` | `Object` | A result of a `fetchClient` query. *Defaults to returning `{ status, body, ok, headers }` from `fetchClient` response* |
| `error?` | `Object` | An object containing an error if present. *Defaults to an `Error` object with a thrown `fetch` error. This is not for API errors (e.g. Status 500 or 400). See `data` for that* |
| `run` | `async () => {}` | A function for bypassing the cache and firing an API call. This will cause `isLoading === true` and update the cache based on the result. |

### `makeServerFetchye`

**Shape**

```
const fetchye = makeServerFetchye({ store, cacheSelector, fetchClient });

const { data, error } = await fetchye(key, options, fetcher);
```

**`makeServerFetchye` Arguments**

| name | type | required | description |
|---|---|---|---|
| `store` | `ReduxStore` | `true` | A [Redux Store](https://redux.js.org/api/store) instance. |
| `cacheSelector` | `(state: ReduxState) => state` | `true` | A function that returns the location inside Redux State to the Fetchye Cache. (See [Redux Selectors](https://redux.js.org/recipes/computing-derived-data)). |
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

### `FetchyeReduxProvider`

**Shape**

```
<Provider>
  <FetchyeReduxProvider fetchClient={fetch} cacheSelector={state => state}>
    {children}
  </FetchyeReduxProvider>
</Provider>
```

**Context**

| name | type | required | description |
|---|---|---|---|
| `ReactReduxContext` | `ReactReduxContext` | `true` | A [Redux Context](https://react-redux.js.org/api/provider) from a `<Provider />`. |

**Props**

> Note: Changing props after mounting will not result in altering `FetchyeContext`. This was decided upon for memoization reasons.

| name | type | required | description |
|---|---|---|---|
| `fetchClient` | `ES6Fetch` | `true` | A [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) compatible function. |
| `cacheSelector` | `(state: ReduxState) => state` | `true` | A function that returns the location inside Redux State to the Fetchye Cache. (See [Redux Selectors](https://redux.js.org/recipes/computing-derived-data)). |

## 📢 Mission

The Fetchye project wishes to bring a more flexible central caching experience using the best ideas
of the Redux design pattern and options for the developer to choose how their
data is stored. Fetchye provides React Context driven caching options backed by your choice
of pure React (via `useReducer`) or Redux. Fetchye Context Providers do not rely on
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