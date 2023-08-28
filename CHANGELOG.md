# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.3.0](https://github.com/americanexpress/fetchye/compare/v1.2.0...v1.3.0) (2023-08-28)


### Features

* **signal:** remove passed signal from defautlMapOptionsToKey ([#83](https://github.com/americanexpress/fetchye/issues/83)) ([8bb4b36](https://github.com/americanexpress/fetchye/commit/8bb4b36647d6004277153362526434fc25f230bd))





## [1.2.1](https://github.com/americanexpress/fetchye/compare/v1.2.0...v1.2.1) (2023-04-06)


### Bug Fixes

* **reduxProvider:** dependency array had bad entry ([#73](https://github.com/americanexpress/fetchye/issues/73)) ([69ae888](https://github.com/americanexpress/fetchye/commit/69ae8882a4da2b63b24cb0783a87fd42d43d44cd))





# [1.2.0](https://github.com/americanexpress/fetchye/compare/v1.1.0...v1.2.0) (2023-03-07)


### Bug Fixes

* **cache:** remove previous data or error on new run ([#66](https://github.com/americanexpress/fetchye/issues/66)) ([f921ef3](https://github.com/americanexpress/fetchye/commit/f921ef301c7ac28172772acccae0f6274cf76225))
* **peerDeps:** creating fix commit for versioning reasons ([#60](https://github.com/americanexpress/fetchye/issues/60)) ([f63a28e](https://github.com/americanexpress/fetchye/commit/f63a28e09b0796870c5d8b8388ebbdc4bd8639f9))


### Features

* **compute-key:** add support for mapKeyToCacheKey ([#71](https://github.com/americanexpress/fetchye/issues/71)) ([1f29629](https://github.com/americanexpress/fetchye/commit/1f29629a8d4e053546f08c089739f205ee7bbc05))





## [1.1.2](https://github.com/americanexpress/fetchye/compare/v1.1.0...v1.1.2) (2022-10-21)


### Bug Fixes

* **cache:** remove previous data or error on new run ([#66](https://github.com/americanexpress/fetchye/issues/66)) ([f921ef3](https://github.com/americanexpress/fetchye/commit/f921ef301c7ac28172772acccae0f6274cf76225))
* **peerDeps:** creating fix commit for versioning reasons ([#60](https://github.com/americanexpress/fetchye/issues/60)) ([f63a28e](https://github.com/americanexpress/fetchye/commit/f63a28e09b0796870c5d8b8388ebbdc4bd8639f9))





## [1.1.1](https://github.com/americanexpress/fetchye/compare/v1.1.0...v1.1.1) (2022-07-05)


### Bug Fixes

* **peerDeps:** creating fix commit for versioning reasons ([#60](https://github.com/americanexpress/fetchye/issues/60)) ([f63a28e](https://github.com/americanexpress/fetchye/commit/f63a28e09b0796870c5d8b8388ebbdc4bd8639f9))





# [1.1.0](https://github.com/americanexpress/fetchye/compare/v1.0.0...v1.1.0) (2021-10-07)


### Bug Fixes

* **defaultFetcher:** Avoid known hang in node-fetch ([d33399c](https://github.com/americanexpress/fetchye/commit/d33399c71c6809a868c8f6b928ed349d995d8f6a))
* **deps:** fetchye-* depencency versions ([#51](https://github.com/americanexpress/fetchye/issues/51)) ([607358b](https://github.com/americanexpress/fetchye/commit/607358b6906571ab415883b4a878935d50a7bd44))
* **FetchyeProvider:** correct stale data bug ([#47](https://github.com/americanexpress/fetchye/issues/47)) ([2ff8c5a](https://github.com/americanexpress/fetchye/commit/2ff8c5a46c0266852d010cdf800adfe84f6d8d42))
* **jsonError:** update to handle NO CONTENT response ([030f886](https://github.com/americanexpress/fetchye/commit/030f8863de37fef253fcac477d8f30c55bd88cf7))
* **lerna-publish:** syntax ([#32](https://github.com/americanexpress/fetchye/issues/32)) ([21bcc7d](https://github.com/americanexpress/fetchye/commit/21bcc7d840d39c8e7a6e2e2cb95d85fdc1c6b372))
* **makeServerFetchye:** mask errors from server side fetching ([#49](https://github.com/americanexpress/fetchye/issues/49)) ([3503836](https://github.com/americanexpress/fetchye/commit/3503836ea914ff4877af1682c7c672e834286264))


### Features

* **fetchye:** http headers casing does not affect cache key creation ([#53](https://github.com/americanexpress/fetchye/issues/53)) ([5ad1dc2](https://github.com/americanexpress/fetchye/commit/5ad1dc202b35453b5cf036a3792e52e4046be94f))
* **FetchyeReduxProvider:** correct stale data bug ([574ccd3](https://github.com/americanexpress/fetchye/commit/574ccd30120b3f914bf713397bbc0fd1c4598836))





## [1.0.4](https://github.com/americanexpress/fetchye/compare/v1.0.0...v1.0.4) (2021-08-10)


### Bug Fixes

* **defaultFetcher:** Avoid known hang in node-fetch ([d33399c](https://github.com/americanexpress/fetchye/commit/d33399c71c6809a868c8f6b928ed349d995d8f6a))
* **deps:** fetchye-* depencency versions ([#51](https://github.com/americanexpress/fetchye/issues/51)) ([607358b](https://github.com/americanexpress/fetchye/commit/607358b6906571ab415883b4a878935d50a7bd44))
* **FetchyeProvider:** correct stale data bug ([#47](https://github.com/americanexpress/fetchye/issues/47)) ([2ff8c5a](https://github.com/americanexpress/fetchye/commit/2ff8c5a46c0266852d010cdf800adfe84f6d8d42))
* **jsonError:** update to handle NO CONTENT response ([030f886](https://github.com/americanexpress/fetchye/commit/030f8863de37fef253fcac477d8f30c55bd88cf7))
* **lerna-publish:** syntax ([#32](https://github.com/americanexpress/fetchye/issues/32)) ([21bcc7d](https://github.com/americanexpress/fetchye/commit/21bcc7d840d39c8e7a6e2e2cb95d85fdc1c6b372))
* **makeServerFetchye:** mask errors from server side fetching ([#49](https://github.com/americanexpress/fetchye/issues/49)) ([3503836](https://github.com/americanexpress/fetchye/commit/3503836ea914ff4877af1682c7c672e834286264))


### Features

* **FetchyeReduxProvider:** correct stale data bug ([574ccd3](https://github.com/americanexpress/fetchye/commit/574ccd30120b3f914bf713397bbc0fd1c4598836))





## [1.0.3](https://github.com/americanexpress/fetchye/compare/v1.0.0...v1.0.3) (2021-07-14)


### Bug Fixes

* **defaultFetcher:** Avoid known hang in node-fetch ([d33399c](https://github.com/americanexpress/fetchye/commit/d33399c71c6809a868c8f6b928ed349d995d8f6a))
* **jsonError:** update to handle NO CONTENT response ([030f886](https://github.com/americanexpress/fetchye/commit/030f8863de37fef253fcac477d8f30c55bd88cf7))
* **lerna-publish:** syntax ([#32](https://github.com/americanexpress/fetchye/issues/32)) ([21bcc7d](https://github.com/americanexpress/fetchye/commit/21bcc7d840d39c8e7a6e2e2cb95d85fdc1c6b372))
* **FetchyeReduxProvider:** correct stale data bug ([574ccd3](https://github.com/americanexpress/fetchye/commit/574ccd30120b3f914bf713397bbc0fd1c4598836))





## [1.0.2](https://github.com/americanexpress/fetchye/compare/v1.0.0...v1.0.2) (2021-03-08)


### Bug Fixes

* **jsonError:** update to handle NO CONTENT response ([030f886](https://github.com/americanexpress/fetchye/commit/030f8863de37fef253fcac477d8f30c55bd88cf7))
* **lerna-publish:** syntax ([#32](https://github.com/americanexpress/fetchye/issues/32)) ([21bcc7d](https://github.com/americanexpress/fetchye/commit/21bcc7d840d39c8e7a6e2e2cb95d85fdc1c6b372))





## 1.0.1 (2020-11-17)


### Bug Fixes

* **lerna-publish:** syntax ([#32](https://github.com/americanexpress/fetchye/issues/32)) ([21bcc7d](https://github.com/americanexpress/fetchye/commit/21bcc7d840d39c8e7a6e2e2cb95d85fdc1c6b372))


### Features

* **all:** initial oss release ([7532d2b](https://github.com/americanexpress/fetchye/commit/7532d2b72cb8930c9b6ebff386ebb101f7879b70))
* **fetchye:** prepare for initial release [skip ci] ([#28](https://github.com/americanexpress/fetchye/issues/28)) ([2b212df](https://github.com/americanexpress/fetchye/commit/2b212df8fab4405e2b7c51ad687a280cfe27ebbd))





# 1.0.0 (2020-11-12)


### Features

* **all:** initial oss release ([7532d2b](https://github.com/americanexpress/fetchye/commit/7532d2b72cb8930c9b6ebff386ebb101f7879b70))
* **fetchye:** prepare for initial release [skip ci] ([#28](https://github.com/americanexpress/fetchye/issues/28)) ([2b212df](https://github.com/americanexpress/fetchye/commit/2b212df8fab4405e2b7c51ad687a280cfe27ebbd))





# [1.0.0-beta.6](https://github.com/americanexpress/fetchye/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2020-11-12)


### Features

* **fetchye-one-app:** create helpers [skip ci] ([279f301](https://github.com/americanexpress/fetchye/commit/279f30103149da72acc3f5992886cad817cf4830))





# [1.0.0-beta.5](https://github.com/americanexpress/fetchye/compare/v1.0.0-beta.3...v1.0.0-beta.5) (2020-11-04)



# 1.0.0-beta.4 (2020-11-03)

**Note:** Version bump only for package fetchye-project





# [1.0.0-beta.4](https://github.com/americanexpress/fetchye/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2020-11-03)

**Note:** Version bump only for package fetchye-project





# [1.0.0-beta.3](https://github.com/americanexpress/fetchye/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-10-21)


### Bug Fixes

* **immitable-cache:** correctly retrieve error ([bd45e4d](https://github.com/americanexpress/fetchye/commit/bd45e4d05d4e76e40f1a13b126d0c475f572f1a8))

# [1.0.0-beta.2](https://github.com/americanexpress/fetchye/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-09-25)


### Bug Fixes

* **reducer:** ensure loading state is in sync ([3427a2e](https://github.com/americanexpress/fetchye/commit/3427a2e2ce8c413b072aa8808789055a8e08cc94))

# 1.0.0-beta.1 (2020-09-17)


### Bug Fixes

* **headers:** compatible headers to object ([c97211b](https://github.com/americanexpress/fetchye/commit/c97211b94dab04d0c801981f721a7b0134470c6c))


### Features

* **all:** initial oss release ([7532d2b](https://github.com/americanexpress/fetchye/commit/7532d2b72cb8930c9b6ebff386ebb101f7879b70))
* **cache:** add [skip ci] ([a847d60](https://github.com/americanexpress/fetchye/commit/a847d60dfc0783a470ccb1f0e93ffd6727a09209))
* **providers:** add basic and redux [skip ci] ([55e5393](https://github.com/americanexpress/fetchye/commit/55e5393d4fcc3875e28bb3e01490e7a4bd19dabf))
* **useFetchye:** headless [skip ci] ([0c7ff61](https://github.com/americanexpress/fetchye/commit/0c7ff610d42354d9cfa5370574afdeac0c2177f7))

# [1.0.0-alpha.2](https://github.com/americanexpress/fetchye/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-08-26)


### Bug Fixes

* **headers:** compatible headers to object ([c97211b](https://github.com/americanexpress/fetchye/commit/c97211b94dab04d0c801981f721a7b0134470c6c))

# 1.0.0-alpha.1 (2020-08-25)


### Features

* **all:** initial oss release ([7532d2b](https://github.com/americanexpress/fetchye/commit/7532d2b72cb8930c9b6ebff386ebb101f7879b70))
