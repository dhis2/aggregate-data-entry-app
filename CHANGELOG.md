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
