## [100.3.3](https://github.com/dhis2/aggregate-data-entry-app/compare/v100.3.2...v100.3.3) (2023-08-07)


### Bug Fixes

* handle non-standard server time zone ids [DHIS2-15511] ([#344](https://github.com/dhis2/aggregate-data-entry-app/issues/344)) ([c8064db](https://github.com/dhis2/aggregate-data-entry-app/commit/c8064db9601683934ad20e2684a19edfd4a86513))

## [100.3.2](https://github.com/dhis2/aggregate-data-entry-app/compare/v100.3.1...v100.3.2) (2023-06-19)


### Bug Fixes

* prevent moment from using arabic numerals for dates [DHIS2-15277] ([#322](https://github.com/dhis2/aggregate-data-entry-app/issues/322)) ([d822b8c](https://github.com/dhis2/aggregate-data-entry-app/commit/d822b8c5443d8f8fc9810e13ffef749fa1947781))

## [100.3.1](https://github.com/dhis2/aggregate-data-entry-app/compare/v100.3.0...v100.3.1) (2023-06-08)


### Bug Fixes

* **cartesian:** return empty array when no vectors provided ([9ae2b81](https://github.com/dhis2/aggregate-data-entry-app/commit/9ae2b813e3f925796fabed578025f9016caea677))
* **translations:** sync translations from transifex (development) ([474fc7b](https://github.com/dhis2/aggregate-data-entry-app/commit/474fc7bd40498d9bb9e44f8153a44f9efebb2f3b))
* **translations:** sync translations from transifex (development) ([90c5870](https://github.com/dhis2/aggregate-data-entry-app/commit/90c587035977ca87953814580eb822edcc91979a))
* **translations:** sync translations from transifex (development) ([82f9043](https://github.com/dhis2/aggregate-data-entry-app/commit/82f9043c0e8323497fd5b8a77640d9c0b99b9215))
* **translations:** sync translations from transifex (development) ([72dff9a](https://github.com/dhis2/aggregate-data-entry-app/commit/72dff9a6a4f21fe02665c52b9e4fd5571a464310))
* cover useSetFormCompletionMutation with tests ([#315](https://github.com/dhis2/aggregate-data-entry-app/issues/315)) ([930e50e](https://github.com/dhis2/aggregate-data-entry-app/commit/930e50ea20ea83f279a5dc5085288cbc03be35ef))

# [100.3.0](https://github.com/dhis2/aggregate-data-entry-app/compare/v100.2.4...v100.3.0) (2023-05-16)


### Features

* form expiry info and data input periods [DHIS2-14600] [DHIS2-14218] ([#300](https://github.com/dhis2/aggregate-data-entry-app/issues/300)) ([5499e98](https://github.com/dhis2/aggregate-data-entry-app/commit/5499e98f9863713909dbfe7129c9063e767d3ab2)), closes [#313](https://github.com/dhis2/aggregate-data-entry-app/issues/313) [#314](https://github.com/dhis2/aggregate-data-entry-app/issues/314) [#315](https://github.com/dhis2/aggregate-data-entry-app/issues/315)

## [100.2.4](https://github.com/dhis2/aggregate-data-entry-app/compare/v100.2.3...v100.2.4) (2023-04-20)


### Bug Fixes

* lock forms when organisation unit is closed [BETA-25] ([#317](https://github.com/dhis2/aggregate-data-entry-app/issues/317)) ([9a2531e](https://github.com/dhis2/aggregate-data-entry-app/commit/9a2531efaaa74e47564daebd159512effbea2998))

## [100.2.3](https://github.com/dhis2/aggregate-data-entry-app/compare/v100.2.2...v100.2.3) (2023-04-20)


### Bug Fixes

* rollback failed complete [DHIS2-15033] ([#312](https://github.com/dhis2/aggregate-data-entry-app/issues/312)) ([ce559cf](https://github.com/dhis2/aggregate-data-entry-app/commit/ce559cf23d33fa488d63b6e5600aeffc6ef0b0f5))

## [100.2.2](https://github.com/dhis2/aggregate-data-entry-app/compare/v100.2.1...v100.2.2) (2023-04-14)


### Bug Fixes

* use FetchError class from app-runtime [DHIS2-15085] ([#316](https://github.com/dhis2/aggregate-data-entry-app/issues/316)) ([03c4b90](https://github.com/dhis2/aggregate-data-entry-app/commit/03c4b90eab8b41d4ff50a40bd9565a19602d658d))

## [100.2.1](https://github.com/dhis2/aggregate-data-entry-app/compare/v100.2.0...v100.2.1) (2023-04-05)


### Bug Fixes

* include attribute options in completion post [DHIS2-15032] ([#311](https://github.com/dhis2/aggregate-data-entry-app/issues/311)) ([8df1dc0](https://github.com/dhis2/aggregate-data-entry-app/commit/8df1dc0f0ab66b50f33211145774da95576dd5e4))

# [100.2.0](https://github.com/dhis2/aggregate-data-entry-app/compare/v100.1.2...v100.2.0) (2023-03-13)


### Bug Fixes

* **use periods:** check if lastPeriodOfPrevYear exists ([1e65e17](https://github.com/dhis2/aggregate-data-entry-app/commit/1e65e17c09c6936d6edefe3b483c8c37ec2acde9))
* **use periods:** reverse order & add first/last periods of next/prev year if in current year ([f046afa](https://github.com/dhis2/aggregate-data-entry-app/commit/f046afa4a46381b005c71a00f940c96fcbe8fa37))
* implement PR feedback by [@tomzemp](https://github.com/tomzemp) from 2023-03-02 ([e58edee](https://github.com/dhis2/aggregate-data-entry-app/commit/e58edee5fc53f02e4f35ebe6b02e57a73c7c7802))
* implement PR feedback by [@tomzemp](https://github.com/tomzemp) from 2023-03-04 ([5425a28](https://github.com/dhis2/aggregate-data-entry-app/commit/5425a283520bf45359c64acff4039201e92be686))
* use multi-calendar-dates to address periods that don't start on Jan 1st ([8286888](https://github.com/dhis2/aggregate-data-entry-app/commit/8286888d9d64e50d64e44986b649d730d0ecc32f))
* **data value store:** return boolean from isComplete selector ([6bf3a7f](https://github.com/dhis2/aggregate-data-entry-app/commit/6bf3a7f10b8bdc12d5e470afc17ad0c47af19c50))
* **data value store:** set correct default when data value set falsy ([7dd21e2](https://github.com/dhis2/aggregate-data-entry-app/commit/7dd21e21794d019887f998cc99ab879659d080cc))
* **deps:** bump platform and runtime deps [TECH-1462] ([#236](https://github.com/dhis2/aggregate-data-entry-app/issues/236)) ([057addd](https://github.com/dhis2/aggregate-data-entry-app/commit/057addd89f0c22e40fbb8c9d3215bc2aeadc1ee2))
* **deps:** update dependency @tanstack/react-query-devtools to v4.24.13 ([6c19a7b](https://github.com/dhis2/aggregate-data-entry-app/commit/6c19a7b9ede8f4c50d158630bec58e25c6aee5e8))
* **deps:** update dependency @tanstack/react-query-devtools to v4.24.14 ([f7d83d6](https://github.com/dhis2/aggregate-data-entry-app/commit/f7d83d615c85f1d3781cd50ba8ff145bb9568e60))
* **deps:** update dependency chart.js to v3.9.1 ([cf5351c](https://github.com/dhis2/aggregate-data-entry-app/commit/cf5351cd0aa11b4aa2f29da608d0f32a9fa350d6))
* **deps:** update dependency classnames to v2.3.2 ([d054883](https://github.com/dhis2/aggregate-data-entry-app/commit/d0548832b9f6e755aa6107203680902a2b998311))
* **deps:** update dependency final-form to v4.20.9 ([617cd17](https://github.com/dhis2/aggregate-data-entry-app/commit/617cd173e8e02cb005c872deb3fa0db8b55e1cfc))
* **deps:** update dependency html-react-parser to v1.4.14 ([9758efc](https://github.com/dhis2/aggregate-data-entry-app/commit/9758efc73bf06ed61301629975a1be2689246d46))
* **deps:** update dependency idb-keyval to v6.2.0 ([fd3f936](https://github.com/dhis2/aggregate-data-entry-app/commit/fd3f9365aa806dff3d4a4e3c49e3daec6e7ed86e))
* **deps:** update dependency query-string to v7.1.2 ([f833f36](https://github.com/dhis2/aggregate-data-entry-app/commit/f833f368a897bc04ff42ecf72e6eaf86d1c80bd6))
* **deps:** update dependency query-string to v7.1.3 ([1d13164](https://github.com/dhis2/aggregate-data-entry-app/commit/1d1316408f02e6fd9897da4d41281efa1c8215d4))
* **deps:** update dependency re-reselect to v4.0.1 ([1ca5332](https://github.com/dhis2/aggregate-data-entry-app/commit/1ca5332529a8f4373df7a43f939fd9c43a2f3f34))
* **deps:** update dependency react-chartjs-2 to v4.3.1 ([347d055](https://github.com/dhis2/aggregate-data-entry-app/commit/347d05532dd843a9242801b289e7b193130d20e2))
* **deps:** update dependency react-router-dom to v5.3.4 ([3e1c1c9](https://github.com/dhis2/aggregate-data-entry-app/commit/3e1c1c95c2b04388e85cd1de2752a384910c57e1))
* **deps:** update dependency reselect to v4.1.7 ([d90509f](https://github.com/dhis2/aggregate-data-entry-app/commit/d90509f6cf6706595eaf9106497a62dd666769ce))
* **deps:** update dependency zustand to v4.1.4 ([8494e6b](https://github.com/dhis2/aggregate-data-entry-app/commit/8494e6b381760f09177db85e952f46ada27bddec))
* **deps:** update dependency zustand to v4.1.5 ([a3595fc](https://github.com/dhis2/aggregate-data-entry-app/commit/a3595fc84cfcdddb8740f2a2fdfe738d22adea83))
* **deps:** update tanstack-query monorepo to v4.16.1 ([588f5ee](https://github.com/dhis2/aggregate-data-entry-app/commit/588f5ee70b57529d4a5a0e29c7443b10589c92aa))
* **deps:** update tanstack-query monorepo to v4.17.1 ([af7b3c1](https://github.com/dhis2/aggregate-data-entry-app/commit/af7b3c1a05a29c14844d91ae855e031bbb2f9571))
* **deps:** update tanstack-query monorepo to v4.18.0 ([ebe89f2](https://github.com/dhis2/aggregate-data-entry-app/commit/ebe89f2ea1cec3c464cfad60f48d3c24d08895dd))
* **deps:** update tanstack-query monorepo to v4.19.0 ([3fc13e3](https://github.com/dhis2/aggregate-data-entry-app/commit/3fc13e3448fa41d029d286341d5fcc768b1ef5db))
* **deps:** update tanstack-query monorepo to v4.19.1 ([1641918](https://github.com/dhis2/aggregate-data-entry-app/commit/16419185dbb03d0c97b0682c4905c298a6f95403))
* **deps:** update tanstack-query monorepo to v4.20.2 ([6500139](https://github.com/dhis2/aggregate-data-entry-app/commit/6500139ec1cffe1929dada172a38891482d3aa6c))
* **deps:** update tanstack-query monorepo to v4.20.4 ([9c44d3e](https://github.com/dhis2/aggregate-data-entry-app/commit/9c44d3e8f98f5ef7678d0de5ee6fa73d8d886d1b))
* **deps:** update tanstack-query monorepo to v4.23.0 ([795f159](https://github.com/dhis2/aggregate-data-entry-app/commit/795f159f2f98816394c941af81ed38cd2aa56cf4))
* **deps:** update tanstack-query monorepo to v4.24.10 ([8bb044e](https://github.com/dhis2/aggregate-data-entry-app/commit/8bb044e995b357d8ae3e1ed352fdd0cb75884f42))
* **deps:** update tanstack-query monorepo to v4.24.4 ([fad8537](https://github.com/dhis2/aggregate-data-entry-app/commit/fad853704bbc779ff3b7fc090a7aa3c7f616c8d0))
* **deps:** update tanstack-query monorepo to v4.24.6 ([5664987](https://github.com/dhis2/aggregate-data-entry-app/commit/56649874dacd56bd4bf65e6648ed31e94d0b1652))
* **deps:** update tanstack-query monorepo to v4.24.9 ([da668de](https://github.com/dhis2/aggregate-data-entry-app/commit/da668de7b4535b4ca4d255ce223040d538651f4a))
* **total-cell:** clear total value when printing empty form ([#298](https://github.com/dhis2/aggregate-data-entry-app/issues/298)) ([c3f3ecf](https://github.com/dhis2/aggregate-data-entry-app/commit/c3f3ecfe6c3725091df310cdc4346a6cac37f68b))
* adjust disabled org unit style ([27945ca](https://github.com/dhis2/aggregate-data-entry-app/commit/27945cadc2e853abbc4ebde04d10f06ba517a715))
* metadata and user info error handling ([#294](https://github.com/dhis2/aggregate-data-entry-app/issues/294)) ([7581e37](https://github.com/dhis2/aggregate-data-entry-app/commit/7581e37a0a18cc480dd410d823241a9cb23d8397))
* **highlighted field store:** correct wrong initial state ([a6b53ae](https://github.com/dhis2/aggregate-data-entry-app/commit/a6b53aeaf8e58de1c2dd2e53b11b0e195105911f))
* **translations:** sync translations from transifex (development) ([5eac173](https://github.com/dhis2/aggregate-data-entry-app/commit/5eac17312874d357fbecb549ccf9b94c543aa66a))
* **translations:** sync translations from transifex (development) ([a02ad04](https://github.com/dhis2/aggregate-data-entry-app/commit/a02ad049f5b1cbf1da8ac9c85d2cb5ae1a1fcc88))
* **translations:** sync translations from transifex (development) ([081ad05](https://github.com/dhis2/aggregate-data-entry-app/commit/081ad057202afb510348b390f12bbc6e9ccc4cd8))
* **translations:** sync translations from transifex (development) ([65a053d](https://github.com/dhis2/aggregate-data-entry-app/commit/65a053daadad5aba556df7368bbe98598f25bda5))
* **translations:** sync translations from transifex (development) ([48f6674](https://github.com/dhis2/aggregate-data-entry-app/commit/48f66740f72c25b03245c8b8e303748e1b325f7f))
* clean up audit styling [TECH-1469] [TECH-1470] ([#237](https://github.com/dhis2/aggregate-data-entry-app/issues/237)) ([a545ee8](https://github.com/dhis2/aggregate-data-entry-app/commit/a545ee8fd22f17e2805476d040c4057bebcee276))
* clear selections with only dataset [DHIS2-14039] ([#243](https://github.com/dhis2/aggregate-data-entry-app/issues/243)) ([e9beb53](https://github.com/dhis2/aggregate-data-entry-app/commit/e9beb53826dd2eadf52f037ad2889b3f5ede8fc1))
* ensure biweeks allow entry over entire year [TECH-1308] ([#242](https://github.com/dhis2/aggregate-data-entry-app/issues/242)) ([bf931d8](https://github.com/dhis2/aggregate-data-entry-app/commit/bf931d81afa36156701a81ac1d36159f4c87acf8))
* handle remove periods calculation for end-of-month [DHIS2-14007] ([#238](https://github.com/dhis2/aggregate-data-entry-app/issues/238)) ([c2b5724](https://github.com/dhis2/aggregate-data-entry-app/commit/c2b5724270d2b3dc4a4350f25337600f4c783fa6))


### Features

* **option-set:** add multi text support ([#290](https://github.com/dhis2/aggregate-data-entry-app/issues/290)) ([985f955](https://github.com/dhis2/aggregate-data-entry-app/commit/985f955d9d0ad7c82ab2fe6deb85b0ea8b6d89c0)), closes [#241](https://github.com/dhis2/aggregate-data-entry-app/issues/241)
* **zustand:** create wrapper ([23d8182](https://github.com/dhis2/aggregate-data-entry-app/commit/23d8182d5668915c54fc77afaf773455b2206528))

## [100.1.2](https://github.com/dhis2/aggregate-data-entry-app/compare/v100.1.1...v100.1.2) (2022-11-07)


### Bug Fixes

* **indicators:** handle expressions that cannot be evaluated ([#241](https://github.com/dhis2/aggregate-data-entry-app/issues/241)) ([2942460](https://github.com/dhis2/aggregate-data-entry-app/commit/29424606367c398c791f633c69b2aaac1eb974f8))

## [100.1.1](https://github.com/dhis2/aggregate-data-entry-app/compare/v100.1.0...v100.1.1) (2022-11-07)


### Bug Fixes

* **translations:** sync translations from transifex (development) ([6d043dc](https://github.com/dhis2/aggregate-data-entry-app/commit/6d043dc3ddcb71fff2d7446761ed76cb73d6eaa3))
* **translations:** sync translations from transifex (development) ([cccf3af](https://github.com/dhis2/aggregate-data-entry-app/commit/cccf3af8f90faf76a78be5833227313c4b68b53b))
* **translations:** sync translations from transifex (development) ([756b467](https://github.com/dhis2/aggregate-data-entry-app/commit/756b467cf33fb6f37c7ae99c6269a352525263f7))
* **translations:** sync translations from transifex (development) ([02de709](https://github.com/dhis2/aggregate-data-entry-app/commit/02de709abca10f2b056ebce6436d1e311430c9f8))
* **translations:** sync translations from transifex (development) ([e6044e8](https://github.com/dhis2/aggregate-data-entry-app/commit/e6044e85798683bee3300ec3196ef541944562f8))
* **translations:** sync translations from transifex (development) ([be85c55](https://github.com/dhis2/aggregate-data-entry-app/commit/be85c55047f130fca838ebbf15ab9941b202f38f))
* **translations:** sync translations from transifex (development) ([ecd8091](https://github.com/dhis2/aggregate-data-entry-app/commit/ecd8091f5759d46b98e86441f05357d2258e0c68))
* **translations:** sync translations from transifex (development) ([5a402ae](https://github.com/dhis2/aggregate-data-entry-app/commit/5a402ae00d8c113463b3a3c05dc57b0035860d0b))
* **translations:** sync translations from transifex (development) ([9fa7643](https://github.com/dhis2/aggregate-data-entry-app/commit/9fa7643ecc8e21abc37078760796a07303796b32))
* **translations:** sync translations from transifex (development) ([bce1688](https://github.com/dhis2/aggregate-data-entry-app/commit/bce16887696eff0a790f2a0f9e2ee001325b4ccc))
* update periods height [DHIS2-14006] ([6470b48](https://github.com/dhis2/aggregate-data-entry-app/commit/6470b48466db300684dca17bccbbec8c6d24e4af))

# [100.1.0](https://github.com/dhis2/aggregate-data-entry-app/compare/v100.0.0...v100.1.0) (2022-10-21)


### Bug Fixes

* adjust client time to server timezone when computing date ranges ([#165](https://github.com/dhis2/aggregate-data-entry-app/issues/165)) ([af3fa39](https://github.com/dhis2/aggregate-data-entry-app/commit/af3fa395fc9c7d2464ce7afcbefc25e4696f758f))
* adjust synced cell style ([#199](https://github.com/dhis2/aggregate-data-entry-app/issues/199)) ([32a9d78](https://github.com/dhis2/aggregate-data-entry-app/commit/32a9d785956f7656185fadecd83c95e0eadc229e))
* allow for unit paths starting at the real root instead of user root ([#197](https://github.com/dhis2/aggregate-data-entry-app/issues/197)) ([0191551](https://github.com/dhis2/aggregate-data-entry-app/commit/0191551d1726f513475e3ea79fd7701ca86ef086))
* clear sync-status when value changes ([#182](https://github.com/dhis2/aggregate-data-entry-app/issues/182)) ([d4d6d29](https://github.com/dhis2/aggregate-data-entry-app/commit/d4d6d29a32bc4cdae21e92002a9ba9b531e1224c))
* ensure offline units are fetched correctly for users deep in the hierarchy ([#226](https://github.com/dhis2/aggregate-data-entry-app/issues/226)) ([d9d4632](https://github.com/dhis2/aggregate-data-entry-app/commit/d9d4632ebc4c2989008c594f578cd9391c9d9790))
* fix disabled cell styling [TECH-1466] ([#234](https://github.com/dhis2/aggregate-data-entry-app/issues/234)) ([0334733](https://github.com/dhis2/aggregate-data-entry-app/commit/0334733e6386f6fbdeda2fc7ed1dd09ff3eaff12))
* global filter field size ([#221](https://github.com/dhis2/aggregate-data-entry-app/issues/221)) ([7b003d8](https://github.com/dhis2/aggregate-data-entry-app/commit/7b003d835c3ad58b4e0b33f1906d5e37699894dd))
* handle inconsistent formats from api for orgUnits [DHIS2-13888] ([#210](https://github.com/dhis2/aggregate-data-entry-app/issues/210)) ([ab266ca](https://github.com/dhis2/aggregate-data-entry-app/commit/ab266ca53ea58563a8d8e884cf8dde615c86622f))
* handle invalid parameters in URL [TECH-1382] [TECH-1384] ([#208](https://github.com/dhis2/aggregate-data-entry-app/issues/208)) ([3c14bd8](https://github.com/dhis2/aggregate-data-entry-app/commit/3c14bd85c4ebf3be8a9ec0388ecce498aad30724))
* handle temporal mutation errors ([#206](https://github.com/dhis2/aggregate-data-entry-app/issues/206)) ([0bb923d](https://github.com/dhis2/aggregate-data-entry-app/commit/0bb923dd93a270ab7589d5a941dae8ea5b715b02))
* highlighted fields performance ([#155](https://github.com/dhis2/aggregate-data-entry-app/issues/155)) ([554025c](https://github.com/dhis2/aggregate-data-entry-app/commit/554025ccca2063af53d20c77b65e27b8f9ada478))
* import locales so app has access to them ([#207](https://github.com/dhis2/aggregate-data-entry-app/issues/207)) ([662ddc6](https://github.com/dhis2/aggregate-data-entry-app/commit/662ddc67917fd5c9143785d152edc06bdc60a025))
* make bottom bar buttons small [DHIS2-13956] ([c507860](https://github.com/dhis2/aggregate-data-entry-app/commit/c50786035764e79d2604f75816b892de32b95365))
* make useDataValueParams and useApiAttributeParams stable ([978a7b9](https://github.com/dhis2/aggregate-data-entry-app/commit/978a7b9c3de5166b43b358403df017c7bc9297c4))
* manage unsaved comments when moving cells ([b04cbfd](https://github.com/dhis2/aggregate-data-entry-app/commit/b04cbfd2454d4b369d795847821f8b485761ec04))
* manage unsaved limits when moving cells ([dd14d41](https://github.com/dhis2/aggregate-data-entry-app/commit/dd14d412c6de775499930518e82dd6048eae1ed9))
* or between shortcuts [DHIS2-13955] ([d71a93b](https://github.com/dhis2/aggregate-data-entry-app/commit/d71a93b3031b367e9dc6059501e46da4499d03fe))
* print styles [TECH-1312] ([#217](https://github.com/dhis2/aggregate-data-entry-app/issues/217)) ([5533e00](https://github.com/dhis2/aggregate-data-entry-app/commit/5533e00af0710aec7ff74fb70df387361c7f869d))
* remove defaultOnSuccess for queries ([75e257e](https://github.com/dhis2/aggregate-data-entry-app/commit/75e257e209f44968e2fce14cafb0bafc146945fb))
* rerun validation on main bar button click ([d62e4a0](https://github.com/dhis2/aggregate-data-entry-app/commit/d62e4a0f0cab1d24144f508397a764ac7e97fd82))
* stop tooltip flickering [DHIS2-13954] ([0c44cb5](https://github.com/dhis2/aggregate-data-entry-app/commit/0c44cb519e95882d8c081e2a7699cff09778e85a))
* update variable name [TECH-1465] ([#231](https://github.com/dhis2/aggregate-data-entry-app/issues/231)) ([1fd682f](https://github.com/dhis2/aggregate-data-entry-app/commit/1fd682f1feed452c49ce85b9af0bf4a77c8d3010))
* **audit history:** update processing, clean up [TECH-1281] ([#131](https://github.com/dhis2/aggregate-data-entry-app/issues/131)) ([7464efb](https://github.com/dhis2/aggregate-data-entry-app/commit/7464efbe01cc6161625d264018c05b95c0589042))
* **basic information:** display client date in tooltip ([da867a7](https://github.com/dhis2/aggregate-data-entry-app/commit/da867a71220e735748fa5eec421748b194318866))
* **data-value-set:** disable when mutating ([85e7cbc](https://github.com/dhis2/aggregate-data-entry-app/commit/85e7cbc1e911c893946b2602f77fc2aa0160fe72))
* **dates:** use server time when appropriate ([b8cbdbc](https://github.com/dhis2/aggregate-data-entry-app/commit/b8cbdbc62b029030d75d79db5b2a5b3824132324))
* **deps:** pin dependencies ([35fdd45](https://github.com/dhis2/aggregate-data-entry-app/commit/35fdd458212d6fdc29623d6dce71940e7b16c7a6))
* **deps:** update dependency @dhis2/app-runtime to v3.5.0 ([#224](https://github.com/dhis2/aggregate-data-entry-app/issues/224)) ([f532607](https://github.com/dhis2/aggregate-data-entry-app/commit/f53260767dc31719bfaa4bb8a235d22db059437c))
* **deps:** update dependency @dhis2/ui to v8.5.3 ([#225](https://github.com/dhis2/aggregate-data-entry-app/issues/225)) ([7b27ee1](https://github.com/dhis2/aggregate-data-entry-app/commit/7b27ee124e8bfcfc9ed7c95292dac18f4078deac))
* **filter-field:** hide clear-button when no filter ([#222](https://github.com/dhis2/aggregate-data-entry-app/issues/222)) ([64b08dc](https://github.com/dhis2/aggregate-data-entry-app/commit/64b08dc35ac6a299d187a0d65ef39aa7279dfecd))
* remove custom styles for data details button ([e47d519](https://github.com/dhis2/aggregate-data-entry-app/commit/e47d51955846472e90c9f46a4d17a1e47bcf63cd))
* update Add limits styling [DHIS2-13958] ([2f528ba](https://github.com/dhis2/aggregate-data-entry-app/commit/2f528ba6eedd5d7c4f909404cf9313e3c8b706b9))
* **translations:** sync translations from transifex (development) ([76859da](https://github.com/dhis2/aggregate-data-entry-app/commit/76859da6cc0508d538c325d6bf58b68e72fffc69))
* **translations:** sync translations from transifex (development) ([db5b088](https://github.com/dhis2/aggregate-data-entry-app/commit/db5b0887a1486bd84baf9b4bfc298a315d57705c))
* **translations:** sync translations from transifex (development) ([9724342](https://github.com/dhis2/aggregate-data-entry-app/commit/9724342bb38762e8dce97517ccda4932a724cb84))
* **use date limit:** prevent recomputing on every re-render ([68dbbcb](https://github.com/dhis2/aggregate-data-entry-app/commit/68dbbcb9da3635a1365dd62ad7b6171f83a4f97d))
* **validation button:** disable validation run when offline [TECH-1377] ([#178](https://github.com/dhis2/aggregate-data-entry-app/issues/178)) ([7838601](https://github.com/dhis2/aggregate-data-entry-app/commit/7838601877857275a054a3af47c18496193168e7))
* use a stable date string instead of an instable date instance ([#201](https://github.com/dhis2/aggregate-data-entry-app/issues/201)) ([dea42b1](https://github.com/dhis2/aggregate-data-entry-app/commit/dea42b1b8779f070f915d8add78eb8879d7f88e3))


### Features

* **headerbar:** integrate offline-status message ([#233](https://github.com/dhis2/aggregate-data-entry-app/issues/233)) ([58f042e](https://github.com/dhis2/aggregate-data-entry-app/commit/58f042e4859701f23ff8a88b28a0e1a48220bd07))
* sync error handling ([#218](https://github.com/dhis2/aggregate-data-entry-app/issues/218)) ([cf3e542](https://github.com/dhis2/aggregate-data-entry-app/commit/cf3e542e4dfdd10e6438ad33c3f0c4bc12f3beae))
* **client server date:** add DRY utils ([7153fe3](https://github.com/dhis2/aggregate-data-entry-app/commit/7153fe3fdfe968c9da370baf8aeebe2b834572db))
* **get current date:** set milliseconds to 0 ([9fa0441](https://github.com/dhis2/aggregate-data-entry-app/commit/9fa0441aeebcb911d9de1bc3a333ee975bbbcded))
* respect F_DATAVALUE_ADD user authority ([e91a847](https://github.com/dhis2/aggregate-data-entry-app/commit/e91a847b7e6197fd1b80cf54251f11aeab4aa1d4))
* **custom forms:** notify user about pre-fetching failure ([9e8374f](https://github.com/dhis2/aggregate-data-entry-app/commit/9e8374f8ea6b9f6a2ee14179cd17e52688e4010f))

# [100.0.0](https://github.com/dhis2/aggregate-data-entry-app/compare/v99.0.0...v100.0.0) (2022-09-22)


### Bug Fixes

* **cat-combo-table:** prevent filter from unmounting data-elements ([#186](https://github.com/dhis2/aggregate-data-entry-app/issues/186)) ([f767dce](https://github.com/dhis2/aggregate-data-entry-app/commit/f767dce8627bd894ffd737dc110b4744f10b7dd6))
* **completion:** do not validate when offline ([454fe6d](https://github.com/dhis2/aggregate-data-entry-app/commit/454fe6d509cd3dc8a945130a14f3ad6bdedc8b71))
* **completion:** set loading to true when starting incompleting ([7e92323](https://github.com/dhis2/aggregate-data-entry-app/commit/7e9232381836900b54454efc9dad1bcc5276ed45))
* **completion mutation:** extract variables correctly after refactoring ([ced05c7](https://github.com/dhis2/aggregate-data-entry-app/commit/ced05c70a705282cf2c82b17f9826d94576c0d71))
* **form completion:** check for empty responses ([fd9c2c2](https://github.com/dhis2/aggregate-data-entry-app/commit/fd9c2c22a3248a1ed839014c7eaf50d3ec8e92cf))
* address post-rebase bugs ([a37c460](https://github.com/dhis2/aggregate-data-entry-app/commit/a37c46010d6caf5bea28d2be38bd0ff5773a8be9))
* **form completion:** cancel open mutations when (in-)completing ([5d66744](https://github.com/dhis2/aggregate-data-entry-app/commit/5d667447f0dc4eaaeedc22488f1889aae250852f))
* add mutation key-factory ([7268141](https://github.com/dhis2/aggregate-data-entry-app/commit/72681416b66b36ea31239629aafdea257b7b01a4))
* completion onMutate and setDefault ([1a6f0ce](https://github.com/dhis2/aggregate-data-entry-app/commit/1a6f0ce438a73582cd2a2ebd97d9334b6050d639))
* remove loading from completion ([4e4ff13](https://github.com/dhis2/aggregate-data-entry-app/commit/4e4ff1354795d4d2f7d15760de40b4f7f66259e4))
* **form completion error alert message:** correct & translate message ([2f18af2](https://github.com/dhis2/aggregate-data-entry-app/commit/2f18af21f15627f6c849316ba5d3381b13eea133))
* typo ([466fe22](https://github.com/dhis2/aggregate-data-entry-app/commit/466fe22d9cdddc63e89211223908742e350c1d26))


### chore

* **release:** release v100.0.0 ([f59bc94](https://github.com/dhis2/aggregate-data-entry-app/commit/f59bc94cf4f5de5301f1a91f05b2d8d1c2d503a5))


### Features

* **completion:** respect "validCompleteOnly" flag on data sets ([41ca259](https://github.com/dhis2/aggregate-data-entry-app/commit/41ca259a7e686e639607ae387ebac86826126eea))
* add completion functionality ([2540111](https://github.com/dhis2/aggregate-data-entry-app/commit/2540111d42496ad97ed47efaf65052c8b6ead35a))
* reduce org-unit-tree network traffic and support prefetching ([#187](https://github.com/dhis2/aggregate-data-entry-app/issues/187)) ([4ce86ac](https://github.com/dhis2/aggregate-data-entry-app/commit/4ce86acb234509fd2f9d1198b332d05309b9d9f8))


### BREAKING CHANGES

* **release:** move to v100 versioning scheme
