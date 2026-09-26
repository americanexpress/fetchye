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
    !isLoading && (
      <p>{data.body.name}</p>
    )
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

> 💡 Makes use of Headless per-Hook Cache Mode

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
    !isLoading && (
      <p>{data?.body.name}</p>
    )
  );
};
```

🏖️[Try this out on Codesandbox](https://codesandbox.io/s/americanexpressfetchye-quick-install-w4ne2)

### `FetchyeProvider` Install

> 💡 When you want a central cache but no extra dependencies

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
  <FetchyeProvider>
    {/* Use your Router to supply children components containing useFetchye */}
    {children}
  </FetchyeProvider>
);
```

In a child React Component, do `useFetchye` queries:

```js
// ...
import { useFetchye } from 'fetchye';

const MyComponent = () => {
  const { isLoading, data } = useFetchye('http://example.com/api/profile');
  return (
    !isLoading && (
      <p>{data?.body.name}</p>
    )
  );
};
```

🏖️[Try this out on Codesandbox](https://codesandbox.io/s/americanexpressfetchye-fetchye-provider-install-y7d8j)

### `FetchyeReduxProvider` Install

> 💡 When you want a central cache integrated with a Redux based project

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
import { FetchyeReduxProvider } from 'fetchye-redux-provider';
import { SimpleCache } from 'fetchye';

const fetchyeCache = SimpleCache({
  // Need to tell Fetchye where the cache reducer will be located
  cacheSelector: (state) => state,
});
const store = createStore(fetchyeCache.reducer);

const ParentComponent = ({ children }) => (
  <Provider store={store}>
    <FetchyeReduxProvider cache={fetchyeCache}>
      {/* Use your Router to supply children components containing useFetchye */}
      {children}
    </FetchyeReduxProvider>
  </Provider>
);
```

In a child React Component, do `useFetchye` queries:

```js
// ...
import { useFetchye } from 'fetchye';

const MyComponent = () => {
  const { isLoading, data } = useFetchye('http://example.com/api/profile');
  return (
    !isLoading && (
      <p>{data.body.name}</p>
    )
  );
};
```

🏖️[Try this out on Codesandbox](https://codesandbox.io/s/americanexpressfetchye-fetchye-redux-provider-install-4d2uz)

### One App Install

> 💡 For when you use the [One App](https://github.com/americanexpress/one-app) Micro-Frontend Framework

**Pros**

- Shared Cache
- De-duplication of API calls
- Redux Dev Tools for debugging and cache inspection
- Excellent centralized server-side data hydration support
- Shared Cache between Micro Frontend Holocron Modules
- Immutable Redux State
- Minimal configuration

**Cons**

- More steps and dependencies

```
npm i -S fetchye fetchye-one-app
```

`fetchye-one-app` provides pre-configured `provider`, `cache`, `oneFetchye` and `oneCacheSelector` to ensure that all modules use the same cache and reduce the chance for cache misses. These all have restricted APIs to reduce the chance for misconfiguration however if you require more control/customization use [`ImmutableCache`](#immutablecache), [`FetchyeReduxProvider`](#fetchyereduxprovider) and [`makeServerFetchye`](#makeserverfetchye). Please bear in mind that this can impact modules which are do not use the same configuration.

Add the `<OneFetchyeProvider />` component from `fetchye-one-app` to your Root Holocron Module, and add the reducer from `OneCache` scoped under `fetchye`:

```jsx
// ...
import { combineReducers } from 'redux-immutable';
import { OneFetchyeProvider, OneCache } from 'fetchye-one-app';

const MyModuleRoot = ({ children }) => (
  <>
    { /* OneFetchyeProvider is configured to use OneCache */}
    <OneFetchyeProvider>
      {/* Use your Router to supply children components containing useFetchye */}
      {children}
    </OneFetchyeProvider>
  </>
);

// ...

MyModuleRoot.holocron = {
  name: 'my-module-root',
  reducer: combineReducers({
    // ensure you scope the reducer under "fetchye", this is important
    // to ensure that child modules can make use of the single cache
    fetchye: OneCache().reducer,
    // ... other reducers
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
    !isLoading && (
      <p>{data?.body.name}</p>
    )
  );
};
```

This minimal configuration works as the provider, cache and makeOneServerFetchye, mentioned later, all follow expected conventions.

## 🤹‍ Usage

### Real-World Example

```jsx
import React from 'react';
import { useFetchye } from 'fetchye';

const BookList = ({ genre }) => {
  const { isLoading, error, data } = useFetchye(`http://example.com/api/books/?genre=${genre}`, {
    headers: {
      'X-Some-Tracer-Id': 1234,
    },
  });

  if (isLoading) {
    return (<p>Loading...</p>);
  }

  if (error || data.status !== 200) {
    return (<p>Oops!</p>);
  }

  return (
    <>
      <h1>Books by {genre}</h1>
      <ul>
        {data.body.map((book) => (
          <li key={book.id}>{book.title} by {book.author}</li>
        ))}
      </ul>
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
    // Check to make sure no error and data.status === 200 for success
  };

  return (
    <form onSubmit={onSubmit}>
      {/* ...form elements using onChange */}
      {/* Hide Submit button when sending POST request */}
      {!isLoading && <button type="submit">Submit</button>}
    </form>
  );
};
```

### Abort Inflight Requests

When you neeed to abort the execution of requests inflight, passing a signal from the [Abort Controller](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) API to `useFetchye` as an option will enable this.

Considering `useFetchye` is a wrapper around fetch, passing a signal is the same and provides the same functionality as demonstrated below.

```jsx
import React, { useEffect } from 'react';
import { useFetchye } from 'fetchye';

const AbortComponent = () => {
  const controller = new AbortController();
  useFetchye('http://example.com/api/books', { signal: controller.signal });

  // eslint-disable-next-line react-hooks/exhaustive-deps -- sample code.
  useEffect(() => () => controller.abort(), []);

  return (
    <div>
      <h1>abortable component</h1>
    </div>
  );
};
```

Instead of setting up a `useEffect` within the component it's possible to pass a hook to signal using packages such as
[use-unmount-signal](https://www.npmjs.com/package/use-unmount-signal/v/1.0.0).

### Sequential API Execution

Passing the 'isLoading' value from one useFetchye call to the 'defer' field of the next will prevent the second call from being made until the first has loaded.

To ensure the second api call is properly formed, you should also check that the data you expect from the first call exists:

```jsx
import React from 'react';
import { useFetchye } from 'fetchye';

const MyFavoriteBook = () => {
  const {
    isLoading: loadingProfile,
    error: profileError,
    data: profile,
  } = useFetchye('http://example.com/api/profile');

  const profileHasBookId = !loadingProfile && profile?.body?.favoriteBookId;
  const {
    isLoading: loadingBook,
    error: bookError,
    data: favoriteBook,
  } = useFetchye('http://example.com/api/books', {
    defer: !profileHasBookId,
    method: 'POST',
    body: JSON.stringify({
      bookId: profile?.body?.favoriteBookId,
    }),
  });

  if (loadingProfile) {
    return (<p>Loading Profile...</p>);
  }
  if (profileError || profile.status !== 200) {
    return (<p>Oops!</p>);
  }
  if (loadingBook) {
    return (<p>Loading Favourite Book...</p>);
  }
  if (bookError || favoriteBook.status !== 200) {
    return (<p>Oops!</p>);
  }

  return (
    favoriteBook.status === 200 && (
      <>
        <h1>My Favorite Book</h1>
        <h2>{favoriteBook.body.title}</h2>
      </>
    )
  );
};
```

Alternatively, you can pass a function as the first parameter to useFetchye, if this function throws an exception, or returns a falsy value, the call will automatically be 'deferred' until the function does not throw.

This only works if the sequential data is passed to the second call in the url.

In this example, the function will throw `Cannot read properties of undefined` when trying to access 'favoriteBookId' in the non-existent body of the profile:

```jsx
import React from 'react';
import { useFetchye } from 'fetchye';

const MyFavoriteBook = () => {
  const {
    isLoading: loadingProfile,
    error: profileError,
    data: profile,
  } = useFetchye('http://example.com/api/profile');
  const {
    isLoading: loadingBook,
    error: bookError,
    data: favoriteBook,
  } = useFetchye(() => `http://example.com/api/books/${profile.body.favoriteBookId}`);

  if (loadingProfile) {
    return (<p>Loading Profile...</p>);
  }
  if (profileError || profile.status !== 200) {
    return (<p>Oops!</p>);
  }
  if (loadingBook) {
    return (<p>Loading Favourite Book...</p>);
  }
  if (bookError || favoriteBook.status !== 200) {
    return (<p>Oops!</p>);
  }

  return (
    favoriteBook.status === 200 && (
      <>
        <h1>My Favorite Book</h1>
        <h2>{favoriteBook.body.title}</h2>
      </>
    )
  );
};
```

### Refreshing

```jsx
import React from 'react';
import { useFetchye } from 'fetchye';

const BookList = ({ genre }) => {
  const {
    isLoading,
    data: booksData,
    run,
  } = useFetchye(`http://example.com/api/books/?genre=${genre}`);

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

Custom fetchers allow for creating reusable data fetching logic for specific APIs or custom needs. They allow for a centrally provided
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
    // eslint-disable-next-line no-console -- error useful to developer in specific error case
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

### Controlling the Cache Key

By passing mapKeyToCacheKey as an option you can customize the cacheKey without affecting the key. This allows you to control the cacheKey directly to enable advanced behaviour in your cache.

Note: This option can lead to unexpected behaviour in many cases. Customizing the cacheKey in this way could lead to accidental collisions that lead to fetchye providing the 'wrong' cache for some of your calls, or unnecessary cache-misses causing significant performance degradation.

In this example the client can dynamically switch between http and https depending on the needs of the user, but should keep the same cache key.

Therefore, mapKeyToCacheKey is defined to transform the url to always have the same protocol in the cacheKey.

```jsx
import React from 'react';
import { useFetchye } from 'fetchye';

const BookList = ({ ssl }) => {
  const { isLoading, data } = useFetchye(`${ssl ? 'https' : 'http'}://example.com/api/books/`,
    {
      mapKeyToCacheKey: (key) => key.replace('https://', 'http://'),
    }
  );

  if (isLoading) {
    return (<p>Loading...</p>);
  }

  return (
    {/* Render data */ }
  );
};
```

### Passing dynamic headers

When you call the `run` function returned from useFetchye, it will use the values last rendered into the hook.

This means any correlationId, timestamp, or any other unique dynamic header you might want sent to the server will use its previous value.

To overcome this, you can specify a function instead of a `headers` object in the options.

This function will be called, to re-make the headers just before an API call is made, even when you call `run`.

Note: If you don't want the dynamic headers to result in a cache miss, you must remove the keys of the dynamic headers from the options using `mapOptionsToKey` (see example below that uses the `ignoreHeadersByKey` helper).

```jsx
import React from 'react';
import { useFetchye, ignoreHeadersByKey } from 'fetchye';
import uuid from 'uuid';

const BookList = () => {
  const { isLoading, data } = useFetchye('http://example.com/api/books/', {
    // remove the 'correlationId' header from the headers, as its the only dynamic header
    mapOptionsToKey: ignoreHeadersByKey(['correlationId']),
    headers: () => ({
      // static headers are still fine, and can be specified here like normal
      staticHeader: 'staticValue',
      // This header will be generated fresh for every call out of the system
      correlationId: uuid(),
    }),
  });

  if (isLoading) {
    return (<p>Loading...</p>);
  }

  return (
    {/* Render data */ }
  );
};

export default BookList;
```

### SSR

#### One App SSR

Using `oneFetchye` from `fetchye-one-app` ensures that the cache will always be configured correctly.

```jsx
import React from 'react';
import { useFetchye } from 'fetchye';
import { oneFetchye } from 'fetchye-one-app';

const BookList = () => {
  const { isLoading, data } = useFetchye('http://example.com/api/books/');

  if (isLoading) {
    return (<p>Loading...</p>);
  }

  return (
    {/* Render data */ }
  );
};

BookList.holocron = {
  loadModuleData: async ({ store: { dispatch } }) => {
    if (global.BROWSER) {
      return;
    }

    // oneFetchye has same arguments as useFetchye
    // dispatches events into the server side Redux store
    await dispatch(oneFetchye('http://example.com/api/books/'));
  },
};

export default BookList;
```

##### Request deduplication

On the server, `oneFetchye` and `makeOneServerFetchye` share in flight requests between callers of
the same key using Holocron's promise store. If Module A and Module B both request `http://example.com/api/books/` within their
`loadModuleData`, only one request is made and both modules resolve with the same result.

Notes:

- Deduplication is server side only. On the client each `loadModuleData` call behaves as before.
- The cache is always read first, so a request that has already resolved is served from the cache.
- `run()` intentionally bypasses both the cache and deduplication to force a fresh request.
- Keys are deduped by the same hash used for caching, so `mapOptionsToKey` and `mapKeyToCacheKey`
  apply. Modules must use matching keys and options for a request to be shared.

#### React Server Components with One App

When a module is rendered as a React Server Component (RSC), importing anything from `fetchye` or `fetchye-one-app` will automatically resolve to their `react-server` build via the `"react-server"` [export condition](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md#react-server-condition). This build de-duplicates requests, using the same Holocron promise store mechanism described above in [Request deduplication](#request-deduplication), but it never touches the Redux store.

Because of this, when using fetchye in a server component:

- You do **not** need to register a `fetchye` reducer.
- You do **not** need a `<FetchyeProvider />` or `<OneFetchyeProvider />` anywhere in your component tree.
- Calling `oneFetchye` directly, inline, inside a React Server Component works out of the box.

(If you want to use fetchye in a client component, you _must_ do the above as normal)

You can still dispatch `oneFetchye` inside `loadModuleData` to kick off a request as early as possible:

```jsx
BookList.holocron = {
  loadModuleData: async ({ dispatch }) => {
    // Not awaited: this fires the request off immediately, but doesn't block
    // loadModuleData from resolving, or the response from starting to stream.
    dispatch(oneFetchye('http://example.com/api/books/'));
  },
};
```

Whether that pre-loaded request streams or blocks depends entirely on whether you `await` it:

- **Don't await it** in `loadModuleData`, and call the same `oneFetchye(key, options)` again (with a matching key/options) from within a Suspense boundary further down the component tree. Since the request was already kicked off, React will suspend the boundary and stream the resolved markup down to the client as soon as the (de-duplicated) request resolves, without blocking the rest of the page.
- **Await it** in `loadModuleData`, and the whole response will block until that request resolves. This is useful for critical, above-the-fold data that should never be streamed in after the initial paint.

##### Using `oneFetchye` in a Server Component

```jsx
// BookList.server.jsx
import { oneFetchye } from 'fetchye-one-app';

// React Server Components can be async functions. Awaiting oneFetchye here
// blocks this component (and anything depending on it) until the request
// resolves. If a matching request was already kicked off elsewhere
// (e.g. loadModuleData), this call is de-duplicated and simply resolves
// with that same in-flight/settled result.
const BookList = async ({ dispatch }) => {
  const { data } = await dispatch(oneFetchye('http://example.com/api/books/'));

  return (
    <ul>
      {data.body.map((book) => (
        <li key={book.id}>{book.title} by {book.author}</li>
      ))}
    </ul>
  );
};

export default BookList;
```

##### Streaming data with `oneFetchye` and Suspense

```jsx
// Page.server.jsx
import { Suspense } from 'react';
import { oneFetchye } from 'fetchye-one-app';
import BookList from './BookList.server';

const Page = ({ dispatch }) => (
  <>
    <h1>My Book Store</h1>
    {/* BookList calls oneFetchye with the same key, and resolves from the */}
    {/* already in-flight request kicked off in loadModuleData above. */}
    {/* React streams this boundary's fallback first, then swaps in the */}
    {/* resolved markup once the shared request settles. */}
    <Suspense fallback={<p>Loading books...</p>}>
      <BookList dispatch={dispatch} />
    </Suspense>
  </>
);

Page.holocron = {
  loadModuleData: async ({ dispatch }) => {
    // Fire-and-forget: kicks off the request but doesn't block rendering.
    dispatch(oneFetchye('http://example.com/api/books/'));
  },
};

export default Page;
```

##### Persistent Cache

> ⚠️ This is an **RSC-only** feature. It is not available in the standard (non-`react-server`) build of `makeServerFetchye`/`oneFetchye`, since those already have a Redux-backed cache to serve repeat requests from.

Unlike in SPA where data can be implicitly cached in the browser between renders, in RSC data is fetched on the server, so by default every render re-issues a fresh upstream request. If your upstream data source is slow or rate-limited enough that this becomes a performance hindrance, you can opt in to a `persistentCache` option, which caches the **resolved response** for a period of time, across requests/renders.

> 💡 The persistent cache is currently **in-memory only**, backed by a single process-wide TTL cache. In the future, support for external/shared stores (eg. Redis) is planned so that the cache can be shared across multiple server instances.

**How it works:**

The persistent cache works in tandem with the [in-flight promise store deduplication](#request-deduplication):

- **First call:** The in-flight `promiseStore` is checked. If a matching request is already in-flight (from a concurrent call), it shares that promise. Otherwise, a new request is issued. The settled **response value** (not the promise itself) is then written to the persistent cache.
- **Cache hit:** Subsequent calls with a matching `key`/`options`/`isolationKey` are served directly from the persistent cache without touching the in-flight store, avoiding both the fetch and any promise deduplication overhead.
- **Rejections:** If the in-flight request fails (throws), the rejection does **not** get written to persistent cache. The rejection stays in the in-flight promise store only, so a retry from a fresh `promiseStore` (e.g., in a later request) will attempt to fetch again rather than reusing the failure.
- **Bypass:** The `run()` function bypasses both the persistent cache and the in-flight promise store for a fresh-data fetch, but does not update the cached value.

Because this cache lives outside of any per-request store, an `isolationKey` is **required** whenever `persistentCache` is used. The `isolationKey` must be a value that uniquely identifies the caller/audience for the data being cached (for example, a username, user id, or auth token for a logged-in experience). This ensures that responses can **never** accidentally leak between users or tenants; two calls for the exact same URL/options but with different `isolationKey`s are always stored and served as fully separate entries.

`persistentCache` is entirely optional and should only be used where your upstream data source is a genuine performance bottleneck; it is not needed for typical requests where deduplication of concurrent, in-flight calls is enough.

```jsx
// BookList.server.jsx
import { oneFetchye } from 'fetchye-one-app';

const BookList = async ({ dispatch, currentUser }) => {
  const { data } = await dispatch(oneFetchye('http://example.com/api/books/', {
    persistentCache: {
      // required: uniquely identifies the audience for this data, preventing
      // any possibility of leaking one user's cached data to another
      isolationKey: currentUser.id,
      // optional: how long (in ms) a resolved response is served from the
      // cache before a fresh request is made again. Cannot be Infinity.
      // Defaults to 5 minutes (300000 ms) if not specified.
      ttl: 30000,
    },
  }));

  return (
    <ul>
      {data.body.map((book) => (
        <li key={book.id}>{book.title} by {book.author}</li>
      ))}
    </ul>
  );
};

export default BookList;
```

#### Next.JS SSR

```jsx
import { useFetchye, makeServerFetchye, SimpleCache } from 'fetchye';

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
    {/* Render data */ }
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
    // eslint-disable-next-line no-console -- error useful to developer in specific error case
    console.error(error.message);
    return {};
  }
}
```

🏖️[Try this out on Codesandbox](https://codesandbox.io/s/americanexpressfetchye-fetchye-ssr-0ktx9)

## Write your own Cache

> 💬 **Note
**: This is for advanced users with special cases. Advanced users should understand Redux design pattern concepts about [Reducers](https://redux.js.org/basics/reducers) and [Actions](https://redux.js.org/basics/actions) before continuing.

Sometimes, the basic opinions of the cache may not be enough for a project's use case. We can create a very basic new Cache configuration like so:

```js
import {
  IS_LOADING,
  SET_DATA,
  DELETE_DATA,
  ERROR,
  CLEAR_ERROR,
} from 'fetchye';

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
  <FetchyeProvider cache={CustomCache()}>
    {children}
  </FetchyeProvider>
);
```

> 💡 Check out [Actions API docs](#actions) and [`SimpleCache.js`](./src/cache/SimpleCache.js) source file. These will give you insights into the actions used in the reducer and practical examples on a working Cache configuration.

## 🎛️ API

**Contents**

- [📖 Table of Contents](#-table-of-contents)
- [✨ Features](#-features)
- [⬇️ Install \& Setup](#️-install--setup)
  - [Quick Install](#quick-install)
  - [`FetchyeProvider` Install](#fetchyeprovider-install)
  - [`FetchyeReduxProvider` Install](#fetchyereduxprovider-install)
  - [One App Install](#one-app-install)
- [🤹‍ Usage](#-usage)
  - [Real-World Example](#real-world-example)
  - [Deferred execution](#deferred-execution)
  - [Abort Inflight Requests](#abort-inflight-requests)
  - [Sequential API Execution](#sequential-api-execution)
  - [Refreshing](#refreshing)
  - [Custom Fetcher](#custom-fetcher)
  - [Controlling the Cache Key](#controlling-the-cache-key)
  - [Passing dynamic headers](#passing-dynamic-headers)
  - [SSR](#ssr)
    - [One App SSR](#one-app-ssr)
      - [Request deduplication](#request-deduplication)
    - [React Server Components with One App](#react-server-components-with-one-app)
      - [Using `oneFetchye` in a Server Component](#using-onefetchye-in-a-server-component)
      - [Streaming data with `oneFetchye` and Suspense](#streaming-data-with-onefetchye-and-suspense)
      - [Persistent Cache](#persistent-cache)
    - [Next.JS SSR](#nextjs-ssr)
- [Write your own Cache](#write-your-own-cache)
- [🎛️ API](#️-api)
  - [`useFetchye`](#usefetchye)
  - [`makeServerFetchye`](#makeserverfetchye)
  - [`makeOneServerFetchye`](#makeoneserverfetchye)
  - [oneFetchye](#onefetchye)
  - [streamFetchye](#streamfetchye)
  - [useStreamedFetchye](#usestreamedfetchye)
  - [Providers](#providers)
    - [`FetchyeProvider`](#fetchyeprovider)
    - [`FetchyeReduxProvider`](#fetchyereduxprovider)
    - [`OneFetchyeProvider`](#onefetchyeprovider)
  - [Caches](#caches)
    - [`SimpleCache`](#simplecache)
    - [`ImmutableCache`](#immutablecache)
    - [`OneCache`](#onecache)
  - [Actions](#actions)
    - [`IS_LOADING`](#is_loading)
    - [`SET_DATA`](#set_data)
    - [`DELETE_DATA`](#delete_data)
    - [`ERROR`](#error)
    - [`CLEAR_ERROR`](#clear_error)
  - [mapOptionToKey Helpers](#mapoptiontokey-helpers)
    - [ignoreHeadersByKey](#ignoreheadersbykey)
- [📢 Mission](#-mission)
- [🏆 Contributing](#-contributing)
- [🗝️ License](#️-license)
- [🗣️ Code of Conduct](#️-code-of-conduct)

### `useFetchye`

A React Hook used for dispatching asynchronous API requests.

**Shape**

```
const { isLoading, data, error, run } = useFetchye(key, { defer: Boolean, mapOptionsToKey: options => options, ...fetchOptions }, fetcher);
```

**Arguments**

| name      | type                                                                                                 | required | description                                                                                                                                        |
|-----------|------------------------------------------------------------------------------------------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| `key`     | `String` or `() => String`                                                                           | `true`   | A string or function returning a string that factors into cache key creation. *Defaults to URL compatible string*.                                 |
| `options` | `Object<Options>`                                                                                    | `false`  | Options to pass through to ES6 Fetch. See **Options** table for the exceptions to this rule. The `options` object factors into cache key creation. |
| `fetcher` | `async (fetchClient: Fetch, key: String, options: Options) => ({ payload: Object, error?: Object })` | `false`  | The async function that calls `fetchClient` by key and options. Returns a `payload` with outcome of `fetchClient` and an optional `error` object.  |

**Options**

| name                | type                                                  | required | description                                                                                                                                                                        |
|---------------------|-------------------------------------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `mapOptionsToKey`   | `(options: Options) => transformedOptions`            | `false`  | A function that maps options to the key that will become part of the cache key. See below for a list of mapOptionsToKey helpers.                                                   |
| `mapKeyToCacheKey`  | `(key: String, options: Options) => cacheKey: String` | `false`  | A function that maps the key for use as the cacheKey allowing direct control of the cacheKey                                                                                       |
| `defer`             | `Boolean`                                             | `false`  | Prevents execution of `useFetchye` on each render in favor of using the returned `run` function. *Defaults to `false`*                                                             |
| `forceInitialFetch` | `Boolean`                                             | `false`  | Allows the consumer to ignore the cached value and instead always fetch from the server for the initial fetch and update the cached value with what returns. *Defaults to `false`* |
| `initialData`       | `Object`                                              | `false`  | Seeds the initial data on first render of `useFetchye` to accomodate server side rendering *Defaults to `undefined`*                                                               |
| `headers`           | `Object` or `() => Object`                            | `false`  | `Object`: as per the ES6 Compatible `fetch` option. `() => Object`: A function to construct a ES6 Compatible `headers` object prior to any api call                                |
| `...restOptions`    | `ES6FetchOptions`                                     | `true`   | Contains any ES6 Compatible `fetch` option. (See [Fetch Options](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Supplying_request_options))                |

**Returns**

| name        | type             | description                                                                                                                                                                     |
|-------------|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `isLoading` | `Boolean`        | A boolean to indicate whether in loading state or not.                                                                                                                          |
| `data`      | `Object`         | A result of a `fetchClient` query. *Defaults to returning `{ status, body, ok, headers }` from `fetchClient` response*                                                          |
| `error?`    | `Object`         | An object containing an error if present. *Defaults to an `Error` object with a thrown `fetch` error. This is not for API errors (e.g. Status 500 or 400). See `data` for that* |
| `run`       | `async () => {}` | A function for bypassing the cache and firing an API call. This will cause `isLoading === true` and update the cache based on the result.                                       |

### `makeServerFetchye`

A factory function used to generate an async/await fetchye function used for server-side API calls.

> 💡 **RSC variant**: When resolved via the `"react-server"` [export condition](#react-server-components-with-one-app) (i.e. imported from a React Server Component), a different implementation of `makeServerFetchye` is automatically loaded. It behaves differently from the standard implementation described below:
> - `cache` and `store` must **not** be passed (they should be omitted, or explicitly `null`). Passing either will cause the returned `fetchye` function to throw, since there is no Redux store to interact with in RSC.
> - `promiseStore` is **required**, rather than optional. Omitting it will cause the returned `fetchye` function to throw. De-duplication always goes through the given `promiseStore` to share in-flight requests. (A `persistentCache` option can still be used to also cache resolved responses across requests.)
> - No Redux actions are ever dispatched; the RSC variant never touches a Redux store, only the `promiseStore`.
> - A `persistentCache` option can be passed as part of the per-call `options`, to opt in to cross-request caching of resolved responses. When not using persistent cache, only the in-flight `promiseStore` is used for deduplication. See [Persistent Cache](#persistent-cache) for full details.

**Shape**

```
const fetchye = makeServerFetchye({ cache, fetchClient });

const { data, error } = await fetchye(key, options, fetcher);
```

**`makeServerFetchye` Arguments**

| name           | type            | required | description                                                                                    |
|----------------|-----------------|----------|------------------------------------------------------------------------------------------------|
| `cache`        | `Cache`         | `true`   | Fetchye `Cache` object.                                                                        |
| `fetchClient`  | `ES6Fetch`      | `true`   | A [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) compatible function. |
| `promiseStore` | `PromiseStore`  | `false`  | An object shaped `{ getLocalPromise(domain, key), storeLocalPromise(domain, key, promise) }`, such as [Holocron's promise store](#request-deduplication). When given, concurrent calls for the same key share a single in flight request. |

**`fetchye` Arguments**

| name      | type                                                                                                 | required | description                                                                                                                                       |
|-----------|------------------------------------------------------------------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `key`     | `String` or `() => String`                                                                           | `true`   | A string or function returning a string that factors into cache key creation. *Defaults to URL compatible string*.                                |
| `options` | `ES6FetchOptions & { persistentCache?: Object }`                                                      | `false`  | Options to pass through to [ES6 Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). In the RSC variant, includes optional `persistentCache` config for cross-request caching. |
| `fetcher` | `async (fetchClient: Fetch, key: String, options: Options) => ({ payload: Object, error?: Object })` | `false`  | The async function that calls `fetchClient` by key and options. Returns a `payload` with outcome of `fetchClient` and an optional `error` object. |

**`persistentCache` Option (RSC variant only)**

| name             | type      | required | description                                                                                                                                       |
|------------------|-----------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `isolationKey`   | `String`  | `true`   | Required when using persistent cache. Uniquely identifies the audience for the cached data (e.g. user id, tenant id), preventing cross-user leaks. |
| `ttl`            | `Number`  | `false`  | Time in milliseconds to cache the resolved response. Cannot be `Infinity`. Defaults to 5 minutes (300000 ms) if not specified.                   |

**`fetchye` Returns**

| name     | type             | description                                                                                                                                                                     |
|----------|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `data`   | `Object`         | A result of a `fetchClient` query. *Defaults to returning `{ status, body, ok, headers }` from `fetchClient` response*                                                          |
| `error?` | `Object`         | An object containing an error if present. *Defaults to an `Error` object with a thrown `fetch` error. This is not for API errors (e.g. Status 500 or 400). See `data` for that* |
| `run`    | `async () => {}` | A function for bypassing the cache and firing an API call. Can be awaited.                                                                                                      |

### `makeOneServerFetchye`

DEPRECATED: You should use `dispatch(oneFetchye(key, options, fetcher))` (see docs below) in place of `makeOneServerFetchye`

A factory function used to generate an async/await fetchye function used for making One App server-side API calls.

**Shape**

```
const fetchye = makeOneServerFetchye({ store, fetchClient });

const { data, error } = await fetchye(key, options, fetcher);
```

**`makeOneServerFetchye` Arguments**

| name          | type       | required | description                                                                                    |
|---------------|------------|----------|------------------------------------------------------------------------------------------------|
| `cache`       | `Cache`    | `false`  | *Defaults to OneCache* Fetchye `Cache` object.                                                 |
| `fetchClient` | `ES6Fetch` | `true`   | A [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) compatible function. |
| `store`       | `Store`    | `true`   | A [Redux Store](https://redux.js.org/api/store)                                                |

**`fetchye` Arguments**

| name      | type                                                                                                 | required | description                                                                                                                                       |
|-----------|------------------------------------------------------------------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `key`     | `String` or `() => String`                                                                           | `true`   | A string or function returning a string that factors into cache key creation. *Defaults to URL compatible string*.                                |
| `options` | `ES6FetchOptions`                                                                                    | `false`  | Options to pass through to [ES6 Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).                                               |
| `fetcher` | `async (fetchClient: Fetch, key: String, options: Options) => ({ payload: Object, error?: Object })` | `false`  | The async function that calls `fetchClient` by key and options. Returns a `payload` with outcome of `fetchClient` and an optional `error` object. |

**`fetchye` Returns**

| name     | type             | description                                                                                                                                                                     |
|----------|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `data`   | `Object`         | A result of a `fetchClient` query. *Defaults to returning `{ status, body, ok, headers }` from `fetchClient` response*                                                          |
| `error?` | `Object`         | An object containing an error if present. *Defaults to an `Error` object with a thrown `fetch` error. This is not for API errors (e.g. Status 500 or 400). See `data` for that* |
| `run`    | `async () => {}` | A function for bypassing the cache and firing an API call. Can be awaited.                                                                                                      |

### oneFetchye

Call fetchye in an imperative context, such as in One App's loadModuleData, in a Redux Thunk, or in an useEffect.

> 💡 **RSC variant**: When resolved via the `"react-server"` [export condition](#react-server-components-with-one-app) (i.e. imported from a React Server Component), a different implementation of `oneFetchye` is automatically loaded. It behaves differently from the standard implementation described below:
> - It always calls the RSC variant of `makeServerFetchye` with `cache: null` and `store: null`, meaning you do **not** need to register a `fetchye` reducer, nor render a `<FetchyeProvider />`/`<OneFetchyeProvider />` anywhere in your component tree.
> - It always builds a `promiseStore` from `dispatch` (via `promiseStoreFromDispatch`), regardless of `global.window`, since request de-duplication is the *only* mechanism available in RSC — there is no cache to serve repeat calls from (unless you opt in to a [Persistent Cache](#persistent-cache) via the `persistentCache` option).
> - The `persistentCache` option allows you to cache resolved responses across requests/renders. See [Persistent Cache](#persistent-cache) for full details.
> - See [React Server Components with One App](#react-server-components-with-one-app) for a full explanation and usage examples.

**Shape**

```
const { data, error } = await dispatch(oneFetchye(key, options, fetcher));
```

**`oneFetchye` Arguments**

| name      | type                                                                                                 | required | description                                                                                                                                       |
|-----------|------------------------------------------------------------------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `key`     | `String` or `() => String`                                                                           | `true`   | A string or function returning a string that factors into cache key creation. *Defaults to URL compatible string*.                                |
| `options` | `ES6FetchOptions`                                                                                    | `false`  | Options to pass through to [ES6 Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).                                               |
| `fetcher` | `async (fetchClient: Fetch, key: String, options: Options) => ({ payload: Object, error?: Object })` | `false`  | The async function that calls `fetchClient` by key and options. Returns a `payload` with outcome of `fetchClient` and an optional `error` object. |

**`onefetchye` Returns**

A promise resolving to an object with the below keys:

| name     | type             | description                                                                                                                                                                     |
|----------|------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `data`   | `Object`         | A result of a `fetchClient` query. *Defaults to returning `{ status, body, ok, headers }` from `fetchClient` response*                                                          |
| `error?` | `Object`         | An object containing an error if present. *Defaults to an `Error` object with a thrown `fetch` error. This is not for API errors (e.g. Status 500 or 400). See `data` for that* |
| `run`    | `async () => {}` | A function for bypassing the cache and firing an API call. Can be awaited.                                                                                                      |

### streamFetchye

A helper to enable streaming for server side Fetchye API calls. The first parameter is a [`oneFetchye`](https://github.com/americanexpress/fetchye?tab=readme-ov-file#oneFetchye) thunk.

Note: The key and options are used to compute the cache key and must match the values passed to `useStreamedFetchye` for a successful cache hit. When `options.throwOnError` is enabled, the function will throw an error for unsuccessful requests which will bubble up to the nearest error boundary. When disabled, the success status of the request must be manually checked.

**Shape**
```js
import { streamFetchye, oneFetchye } from 'fetchye-one-app';

const key = 'https://example.com/api/v2/people';
const options = { throwOnError: true };
const streamFetchyeThunk = streamFetchye(oneFetchye, key, options, fetcher);
const reportError = (response) => {};
// NOTE: When throwOnError is true, promise rejections must be handled.
const loadModuleData = async ({ store: { dispatch } }) => {
  dispatch(streamFetchyeThunk).catch(reportError);
};
```

**`streamFetchye` Arguments**

| name      | type                                                                                                 | required | description                                                                                                                                       |
|-----------|------------------------------------------------------------------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `thunk`     | `Function`                                                                           | `true`   | A fetchye Redux thunk that will be called with the key, options, and fetcher.                               |
| `key`     | `String`                                                                           | `true`   | A string that factors into cache key creation. *Defaults to URL compatible string*.  |
| `options` | `Object<ES6FetchOptions & CustomFetchOptions>`                                                                                     | `false`  | Options to pass through to [ES6 Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). See **Options** table for the CustomFetchOptions which do not get passed through to [ES6 Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).                                            |
| `fetcher` | `async (fetchClient: Fetch, key: String, options: Options) => ({ payload: Object, error?: Object })` | `false`  | The async function that calls `fetchClient` by key and options. Returns a `payload` with outcome of `fetchClient` and an optional `error` object. |

**`streamFetchye` Options**

| name                | type                                                  | required | description                                                                                                                                                                        |
|---------------------|-------------------------------------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `throwOnError`   | `boolean`            | `false`  | This option overrides the default fetchye behavior of catching failed requests. When enabled, unsuccessful responses will throw an error containing the payload of the request. This is intended to be used within a suspense boundary.

**`streamFetchye` Returns**

A promise resolving to the value of the thunk.

### useStreamedFetchye

A React hook used to read streamed data from the server. It will return the raw promise that the user can then parse manually. If there is no existing data from the server, a request will be performed on the client.

The key and options are used to compute the cache key and must match the values passed to `streamedFetchye` for a successful cache hit. When `options.throwOnError` is enabled, the hook will throw an error for unsuccessful responses which will bubble up to the nearest error boundary. When disabled, the success status of the request must be manually checked.

Note: The hook is intended to be used within a suspense boundary.

**Shape**
```jsx
import { use } from 'react';
import { useStreamedFetchye } from 'fetchye-one-app';
import { Spinner } from 'design-library';

const MyComponent = () => {
  const response = useStreamedFetchye('https://example.com/api/v2/people', {
    headers: {
      'Content-Type': 'application/json',
    },
    throwOnError: true,
  });

  const { data } = use(response);

  // If `throwOnError` is false, the success status must be manually checked.
  /*
    if (!data.ok) {
      throw new Error(data.body || 'something went wrong');
    }
  */

  return (
    <p>{data.body.name}</p>
  );
};

const Container = () => (
  <Suspense fallback={<Spinner size="sm" />}>
    <MyComponent />
  </Suspense>
);
```

**`useStreamedFetchye` Arguments**

| name      | type                                                                                                 | required | description                                                                                                                                       |
|-----------|------------------------------------------------------------------------------------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `key`     | `String`                                                                           | `true`   | A string that factors into cache key creation. *Defaults to URL compatible string*.  |
| `options` | `Object<ES6FetchOptions & CustomFetchOptions>`                                                                                     | `false`  | Options to pass through to [ES6 Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). See **Options** table for the CustomFetchOptions which do not get passed through to [ES6 Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).                                            |
| `fetcher` | `async (fetchClient: Fetch, key: String, options: Options) => ({ payload: Object, error?: Object })` | `false`  | The async function that calls `fetchClient` by key and options. Returns a `payload` with outcome of `fetchClient` and an optional `error` object. |

**`useStreamedFetchye` Options**

| name                | type                                                  | required | description                                                                                                                                                                        |
|---------------------|-------------------------------------------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `throwOnError`   | `boolean`            | `false`  | This option overrides the default fetchye behavior of catching failed requests. When enabled, unsuccessful responses will throw an error containing the payload of the request. This is intended to be used within a suspense boundary.


**`useStreamedFetchye` Returns**

A promise resolving to the streamed or local promise.

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

| name          | type       | required | description                                                                                    |
|---------------|------------|----------|------------------------------------------------------------------------------------------------|
| `fetchClient` | `ES6Fetch` | `false`   | A [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) compatible function. |
| `cache`       | `Cache`    | `false`  | Fetchye `Cache` object. *Defaults to `SimpleCache`*                                            |
| `initialData` | `Object`   | `false`  | Initial state to feed into Cache Configuration `reducer`                                       |

#### `FetchyeReduxProvider`

> 💡Requires additional `redux` and `react-redux` packages installed

A React Context Provider that uses Redux to store the centralized cache for all the `useFetchye` React Hooks' query data.

**Shape**

```
import { FetchyeReduxProvider } from "fetchye-redux-provider";
```

```
<Provider>
  <FetchyeReduxProvider cache={SimpleCache()}>
    {children}
  </FetchyeReduxProvider>
</Provider>
```

**Context**

| name                | type                | required | description                                                                       |
|---------------------|---------------------|----------|-----------------------------------------------------------------------------------|
| `ReactReduxContext` | `ReactReduxContext` | `true`   | A [Redux Context](https://react-redux.js.org/api/provider) from a `<Provider />`. |

**Props**

| name          | type       | required | description                                                                                    |
|---------------|------------|----------|------------------------------------------------------------------------------------------------|
| `fetchClient` | `ES6Fetch` | `false`   | A [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) compatible function. |
| `cache`       | `Cache`    | `false`  | Fetchye `Cache` object. *Defaults to `SimpleCache`*                                            |

#### `OneFetchyeProvider`

> 💡Requires additional `redux` and `react-redux` packages installed

A Context Provider that is specifically designed for use with One App.

**Shape**

```js
import { OneFetchyeProvider } from 'fetchye-one-app';
```

```js
<Provider>
  <OneFetchyeProvider>
    {children}
  </OneFetchyeProvider>
</Provider>;
```

**Context**

| name                | type                | required | description                                                                       |
|---------------------|---------------------|----------|-----------------------------------------------------------------------------------|
| `ReactReduxContext` | `ReactReduxContext` | `true`   | A [Redux Context](https://react-redux.js.org/api/provider) from a `<Provider />`. |

**Props**

| name          | type       | required | description                                                                                    |
|---------------|------------|----------|------------------------------------------------------------------------------------------------|
| `fetchClient` | `ES6Fetch` | `false`   | A [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) compatible function. |
| `cache`       | `Cache`    | `false`  | Fetchye `Cache` object. *Defaults to `OneCache`*                                               |

### Caches

A factory function that returns a configuration object, used to instruct a Provider on how to store and retrieve fetchye cache data.

#### `SimpleCache`

This Cache configuration relies on plain old Javascript data structures to back the `reducer` and `getCacheByKey` functions.

**Shape**

```
import { SimpleCache } from 'fetchye';

const cache = SimpleCache({
  cacheSelector,
});
```

**Arguments**

| name            | type               | required | description                                                                                                                                                                                            |
|-----------------|--------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `cacheSelector` | `(state) => state` | `false`  | *Required if using `FetchyeReduxProvider`* A function that returns the location inside Redux State to the Fetchye Cache. (See [Redux Selectors](https://redux.js.org/recipes/computing-derived-data)). |

**Returns**

| name             | type                       | description                                                                                                                                                                                 |
|------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `reducer`        | `(state, action) => state` | A function that reduces the next state of Fetchye Cache. (See [Redux Reducers](https://redux.js.org/basics/reducers)).                                                                      |
| `getCacheByKey`  | `(cache, key) => state`    | A function that returns a minimum of `{ data, loading, error }` for a specific cache key from cache state.                                                                                  |
| `cacheSelector?` | `(state) => state`         | An optionally returned parameter. This function returns the location inside Redux State to the Fetchye Cache. (See [Redux Selectors](https://redux.js.org/recipes/computing-derived-data)). |

#### `ImmutableCache`

> 💡Requires additional `immutable` package installed

This Cache configuration relies on ImmutableJS data structures to back the `reducer` and `getCacheByKey` functions.

**Shape**

```
import { ImmutableCache } from 'fetchye-immutable-cache';

const cache = ImmutableCache({
  cacheSelector
});
```

**Arguments**

| name            | type               | required | description                                                                                                                                                                                            |
|-----------------|--------------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `cacheSelector` | `(state) => state` | `false`  | *Required if using `FetchyeReduxProvider`* A function that returns the location inside Redux State to the Fetchye Cache. (See [Redux Selectors](https://redux.js.org/recipes/computing-derived-data)). |

**Returns**

| name             | type                                      | description                                                                                                                                                                                 |
|------------------|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `reducer`        | `(state, action) => state`                | A function that reduces the next state of Fetchye Cache. (See [Redux Reducers](https://redux.js.org/basics/reducers)).                                                                      |
| `getCacheByKey`  | `(cache = Immutable.Map(), key) => state` | A function that returns a minimum of `{ data, loading, error }` for a specific cache key from cache state.                                                                                  |
| `cacheSelector?` | `(state) => state`                        | An optionally returned parameter. This function returns the location inside Redux State to the Fetchye Cache. (See [Redux Selectors](https://redux.js.org/recipes/computing-derived-data)). |

#### `OneCache`

> 💡Requires additional `immutable` package installed

This Cache configuration is specifically designed to work with One App, it relies on ImmutableJS data structures to back the `reducer` and `getCacheByKey` functions.

**Shape**

```
import { OneCache } from 'fetchye-one-app';

const cache = OneCache();
```

**Returns**

| name             | type                                      | description                                                                                                                                                                                 |
|------------------|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `reducer`        | `(state, action) => state`                | A function that reduces the next state of Fetchye Cache. (See [Redux Reducers](https://redux.js.org/basics/reducers)).                                                                      |
| `getCacheByKey`  | `(cache = Immutable.Map(), key) => state` | A function that returns a minimum of `{ data, loading, error }` for a specific cache key from cache state.                                                                                  |
| `cacheSelector?` | `(state) => state`                        | An optionally returned parameter. This function returns the location inside Redux State to the Fetchye Cache. (See [Redux Selectors](https://redux.js.org/recipes/computing-derived-data)). |

### Actions

These actions power the state transitions described in a Cache Configuration `reducer` function.

#### `IS_LOADING`

An event signaling a state transition to the loading state by hash key.

**Shape**

```
import { IS_LOADING } from 'fetchye-core';
```

```
{
  type: IS_LOADING,
  hash,
}
```

**Child Properties**

| name   | type     | description                                                                                              |
|--------|----------|----------------------------------------------------------------------------------------------------------|
| `hash` | `String` | The hash value generated by [`object-hash`](https://github.com/puleos/object-hash) package for the query |

#### `SET_DATA`

An event signaling a state transition inside a reducer to add or replace the data field and transition away from loading state by hash key.

**Shape**

```
import { SET_DATA } from 'fetchye-core';
```

```
{
  type: SET_DATA,
  hash,
  value,
}
```

**Child Properties**

| name    | type     | description                                                                                              |
|---------|----------|----------------------------------------------------------------------------------------------------------|
| `hash`  | `String` | The hash value generated by [`object-hash`](https://github.com/puleos/object-hash) package for the query |
| `value` | `Object` | Contains the `payload` data returned from the `fetcher` inside `useFetchye`                              |

#### `DELETE_DATA`

An event signaling a state transition inside a reducer to remove the data field by hash key.

**Shape**

```
import { DELETE_DATA } from 'fetchye-core';
```

```
{
  type: DELETE_DATA,
  hash,
}
```

**Child Properties**

| name   | type     | description                                                                                              |
|--------|----------|----------------------------------------------------------------------------------------------------------|
| `hash` | `String` | The hash value generated by [`object-hash`](https://github.com/puleos/object-hash) package for the query |

#### `ERROR`

An event signaling a state transition inside a reducer to insert an error and transition away from loading state by hash key.

**Shape**

```
import { ERROR } from 'fetchye-core';
```

```
{
  type: ERROR,
  hash,
  error,
}
```

**Child Properties**

| name    | type     | description                                                                                              |
|---------|----------|----------------------------------------------------------------------------------------------------------|
| `hash`  | `String` | The hash value generated by [`object-hash`](https://github.com/puleos/object-hash) package for the query |
| `error` | `Error   | String                                                                                                   | null` | Contains the `error` value returned from the `fetcher` inside `useFetchye` |

#### `CLEAR_ERROR`

An event signaling a state transition inside a reducer to remove an error by hash key.

**Shape**

```
import { CLEAR_ERROR } from 'fetchye-core';
```

```
{
  type: CLEAR_ERROR,
  hash,
}
```

**Child Properties**

| name   | type     | description                                                                                              |
|--------|----------|----------------------------------------------------------------------------------------------------------|
| `hash` | `String` | The hash value generated by [`object-hash`](https://github.com/puleos/object-hash) package for the query |

### mapOptionToKey Helpers

These helpers provide a more compact and simple way of common transforms.

There is currently one helper.

#### ignoreHeadersByKey

**Shape**

`(String[]) => mapOptionsToKeyFunction`

**Arguments**

| name   | type            | required | description                                                                                 |
|--------|-----------------|----------|---------------------------------------------------------------------------------------------|
| `keys` | `Array<String>` | `true`   | creates a mapOptionsToKey function that removes headers whose keys match the specified keys |

**Returns**

| name                       | type                      | description                                                                                                                 |
|----------------------------|---------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| `mapOptionsToKey Function` | `mapOptionsToKeyFunction` | A function to be passed to the mapOptionsToKey option in useFetchye, or the `fetchye` function made by `makeServerFetchye`. |

**Example**

```jsx
import React from 'react';
import { useFetchye, ignoreHeadersByKey } from 'fetchye';

const BookList = ({ locale }) => {
  const { isLoading, data } = useFetchye('http://example.com/api/books/', {
    // remove the 'locale' header from the headers when building the cache key
    mapOptionsToKey: ignoreHeadersByKey(['locale']),
    headers: { locale },
  });

  // ... rest of component
};

export default BookList;
```

## 📢 Mission

The Fetchye project wishes to bring a more flexible central caching experience using the best ideas of the Redux design pattern and options for the developer to choose how their data is stored. Fetchye provides React Context driven caching options backed by your choice of pure React (via `useReducer`) or Redux. Unlike many data fetching solutions, Fetchye Context Providers do not rely on singleton statics and can be instantiated throughout an application multiple times for multiple caches if so desired.

## 🏆 Contributing

We welcome Your interest in the American Express Open Source Community on Github. Any Contributor to any Open Source Project managed by the American Express Open Source Community must accept and sign an Agreement indicating agreement to the terms below. Except for the rights granted in this Agreement to American Express and to recipients of software distributed by American Express, You reserve all right, title, and interest, if any, in and to Your Contributions. Please [fill out the Agreement](https://cla-assistant.io/americanexpress/fetchye).

Please feel free to open pull requests and see [CONTRIBUTING.md](./CONTRIBUTING.md) to learn how to get started contributing.

## 🗝️ License

Any contributions made under this project will be governed by the [Apache License 2.0](./LICENSE.txt).

## 🗣️ Code of Conduct

This project adheres to the [American Express Community Guidelines](./CODE_OF_CONDUCT.md). By participating, you are expected to honor these guidelines.
