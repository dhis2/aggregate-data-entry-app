# The Legacy Custom Forms plugin

:::caution
The Legacy Custom Forms plugin is available now on the **beta** channel. You can download it from AppHub or App Management in your instance. Go to App Management, Search for "Data Entry" app, then go to previous releases and make sure to tick "Development" channel. This will display the alpha and beta versions of the app, and you can download or install the latest version in the beta channel.

![Development channel in App Managemt app](./app-management-development-channel.png 'Development channel in App Managemt app')

> Note that the plugin only changes the behaviour of the "Data Entry" app when it comes to custom forms. The rest of the app functionality remains the same as the main stable release.

:::

## Intro

As part of the new Data Entry app, we dropped support for custom logic and JavaScript in custom forms. This presented challenges for implementations that relied heavily on custom forms for a number of years.

### Why did we drop support for custom JavaScript?

The challenge with custom forms generally, and arbitrary JavaScript specifically, is multifold:

-   Security concerns: Anything is possible in these forms as they run in the context of the user (using its permissions and access model). While good governance models around who can author such forms can mitigate some of these risks of malicious JS running in forms, inadvertent security lapses remain possible, for example, hardcoding secrets in the forms, making API calls to other servers, cross-site scripting, etc.

-   More Security concerns (legacy patterns and libraries): The forms often depended on libraries that are old and outdated (jQuery 3.2.1 for example, and plugins related to it). This is inefficient as most of the use cases for such libraries are obsolete and supported natively by modern browsers, but also potentially poses security risks as the forms have an outdated dependency that is not in active development for a number of years.

-   Coupling to web: While native (section and default) forms can be rendered in mobile, custom forms are simply not available on mobile. In practice, there is no conceivable way for traditional custom forms (with all the flexibility they offer) to be supported on mobile one day.

-   UX concerns: The design and UX for custom forms is outdated and doesn't follow modern styles or patterns. They provide a jarring outdated experience compared to other native forms and the rest of the DHIS2 ecosystem of apps. This is not just limited to the look and feel, but it also goes into practical aspects such as worse performance and extraneous API calls that these forms typically perform, as well as being mostly inaccessibile due to using legacy outdated plugins.

These challenges led the core team to initially drop support for custom forms with JavaScript, but this presented a barrier for upgrade for many implementations.

### Why are we reinstating support for custom JavaScript now?

With the Legacy Custom Forms plugin, we reinstate support for custom forms with JavaScript.

The plugin architecture provides a generic extension point for developers. This allows developers - the core team for now, but external developers in the near future - to extend the functionality of the Data Entry app without affecting the main app's security and UX.

In the context of custom forms, this provides a level of isolation and control over the inherent risks of custom JS in forms, but does not mitigate them completely. From the point of view of end-users and custom forms authors, the plugin provides a _pragmatic_ workaround to upgrade to newer versions of DHIS2, but keep their custom forms working with the least amount of friction.

From a technical point of view, the plugin provides a "shim" or an adapter that makes legacy custom forms function similarly to the old Struts legacy app, but in the context of the modern app. This provides improved functionality and integration with the new app's shell (i.e. context selection, data element details, offline support, etc.). A by-product of that is an improvement in security and UX by reusing the main app's functionality whenever possible, for example, accessing the metadata or a data element's details, operations like completing forms, and offline support all happen through the main app's shell.

Our recommendation is still to move away from custom forms whenever possible though. We realise that this is not always achievable, but it is also becoming increasingly possible as many of the use cases that people required custom forms for are now natively supported -- this includes better support for Right-to-Left languages, ability to show tabs (horizontally and vertically), ability to pivot forms, and ability to show custom HTML between sections in forms. We aim to add more native abilities in the future to make custom forms unnecessary.

## Technical overview and notes for forms authors

The aim of the plugin is to support existing custom forms out of the box. To achieve that, the plugin creates a [shim](<https://en.wikipedia.org/wiki/Shim_(computing)>) that keeps the old custom forms API as intact as possible.

This API was the contract that legacy custom forms needed to adhere to, and it consists of functions and components that forms relied on to build its functionality, such as:

1. `dhis2.de` namespace: Custom forms relied on utility functions that were available under [dhis2.de namespace](https://github.com/dhis2/dhis2-core/blob/patch/2.41.6/dhis-2/dhis-web/dhis-web-dataentry/src/main/webapp/dhis-web-dataentry/javascript/form.js). We tried to keep these as intact as possible. Their internals might have changed but the interface exists.

Some of the methods under this namespace was not used by custom forms, rather by Default and Section forms in the old Struts app. These were either removed or marked as deprecated.

2. HTML contracts: Most forms relied on getting the context (organisation unit, data set, period, attribute options) directly from the HTML elements. In order to make the transition seamless, we provide virutal versions of these HTML elements (hidden from the user), this allows code that relied on getting the organisation unit from the HTML component directly (i.e. by using `$('#selectedPeriodId').val()`) to continue to work as if the element still exists.

3. Metadata: The new Data Entry app handles loading and caching metadata differently and more efficiently than the old struts app. For legacy custom forms, the plugin makes this metadata available on load from the modern app shell. We do our best to hide this implementation detail, so legacy helpers such as `dhis2.de.fetchDataSets()` get the data sets from the metadata object in a way that is transparent to the custom form.

For example, all of these global properties remain available, even though the way they're retrieved is fundamentally different from the old Struts app:

-   `dhis2.de.currentOrganisationUnitId`
-   `dhis2.de.currentDataSetId`
-   `dhis2.de.currentPeriodId`
-   `dhis2.de.defaultCategoryCombo`
-   `dhis2.de.categories`
-   `dhis2.de.categoryCombos`
-   `dhis2.de.dataElements`
-   `dhis2.de.optionSets`
-   `dhis2.de.indicatorFormulas`
-   `dhis2.de.dataSets`

We also _tried_ to patch some of these objects so that they look similar to the old app - for example, data sets required a `periodId` field that comes as `period` in the new app. In this case, we patch the object so that both properties are avaialable.

> While we tried to anticipate some of these object differences, there is always a slight chance that your forms relied on a property that doesn't exist anymore. In that case, you can update the form accordingly or raise an issue if you think this is a common use case that the shim should handle.

-   API base URLs: Custom forms had a variety of ways for handling API requests and deciding on the base URL for the DHIS2 instance. We consolidated these so that the shim appends your requests to the correct DHIS2 BASE_URL as defined the instance config. So if you have a call to `/me`, you can just leave it as `/me` and the plugin will append the correct base URL to make the call to `https://play.dhis2.org/42/me`, for example (if your call already specified the base URL correctly, then appending the base URL will be ignored).

:::note
This ability to identify and append the base URL only works if you used jQuery AJAX methods (i.e. `$.get` or `jQuery.post`). This seems to be the case for the majority of forms we have seen. If you are doing requests in a different way (using `fetch` for example), then it is your responsibility to construct the URL properly.

We make a property available in the global window context of the form to make this easier: `window.DHIS2_BASE_URL`
:::

-   `dhis2.shim` namespace: This is a new namespace that is exposed by the plugin for internal use. ⚠️ This should not be treated as a stable API ⚠️. Forms should not directly call the methods available under this namespace, as it might change.

The namespace is necessary to expose certain functionality from the modern app's shell to the custom forms, for example, showing alerts in the modern style in the shell. Given the way JavaScript in custom forms worked, it was necessary to put these helpers under a global object, but form authors should not rely directly on these helpers as they are not guaranteed to remain there in the future.

-   Translations and internationalisation (i18n): Support for internationalisation is very limited. The plugin passes some existing translated strings at build time (similar to what the Struts app did), but if a custom form wants to support localisation and different languages, it needs to roll out its own solution (which was the case in the old app as well).

### Things that might not work out of the box

:::note
It is important to note that -- for anything that doesn't work -- you now have the ability to change the custom form so that it works (for example, so that it doesn't rely on a method that doesn't exist anyore). The aim of the plugin is mainly to minimise the amount of these changes that you need to apply on a form.
:::

#### Relying on internal methods

Because of the nature of how the legacy app was built, any method or library that is part of the Struts app was available globally (in the `window` object in the browser) and as such could be accessed from custom forms. In practice, we haven't seen custom forms that rely on these methods directly, but the possibility exists. For such forms, the authors should update them so that they don't rely on these internal methods anymore.

#### Patched internal methods

A related, likely more common, pattern is custom forms that override these internal methods as a way of fixing bugs in the legacy app. These patches will not work, but they are likely not necessary anymore because the plugin relies on methods from the shell of the modern app.

#### Deprecated `dhis2.de` methods

There are methods under `dhis2.de` that are deprecated now. These are mostly operations that were used by Struts for Default and Section forms, so they are not relevant for custom forms. We have not seen forms that make use of these methods, but in theory -- because everything is global and accessible in the old app -- custom forms could have used these methods.

Some of these methods are:

-   `dhis2.de.loadDataSetAssociations`
-   `dhis2.de.setMetaDataLoaded`
-   `dhis2.de.discardLocalDat`
-   `dhis2.de.uploadLocalData`
-   `dhis2.de.resetSectionFilters`
-   `dhis2.de.clearSectionFilters`
-   `dhis2.de.clearPeriod`
-   `dhis2.de.clearEntryForm`
-   `dhis2.de.getOrFetchDataSetList`
-   `dhis2.de.setAttributesMarkup`
-   `dhis2.de.getAttributesMarkup`
-   `dhis2.de.clearAttributes`
-   `dhis2.de.attributeSelected`
-   `dhis2.de.inputSelected`
-   `dhis2.de.loadOptionSets`
-   `dhis2.de.enableDEDescriptionEvent`
-   `dhis2.de.lockForm`

These will give a warning in the console that are deprecated. Update your forms to not call or depend on these.

##### Deprecated `dhis2.de` properties

There are also properties that no longer exists. These are harder to track and document, given the dynamic nature of JavaScript, but if your custom form tries to access a property `dhis2.de.cst.some_object.some_property` and it gets an error that the object is undefined, then that means it's accessing an object that doesn't exist anymore.

It is very unlikely that this is the case for custom forms, and it should only take a simple update to the form to get it working.

#### Other deprecated libraries

These are some objects that existed in the global `window` context but are removed now. Custom forms should not have been using these directly, but this was possible before as they were available globally to call or even override.

-   `DAO.store`: was used internally for offline capabilities. This is now handled by the modern app shell.

-   `jQuery` and its plugins: we bundled the same version of jQuery that was part of the last Struts app (`3.2.1`) along `jQuery UI` and some of the plugins that are necessary for making the transition easier. These are namely jQuery `select2`, `floatThead` and jQuery `calendar`.

-   We got rid of `underscore`, `jquery.autogrow`, `jquery.cookie` , `jquery.blockUi`, `dhisAjaxSelect` and other utilities that were part of dhis Struts app (for managing storage, translation, etc.).

-   DHIS2 Utilities such as `ouwt` for managing organisation units logic, `dhis2.array` are removed. They are either obsolete or unnecessary in modern browsers. We kept `dhis2.util` namespace as we suspected that some forms might still be using some of the utitlities there.

We did not see any custom forms that use these libraries directly, and their main purpose was to be used internally by the Struts app. If your form depended on one of these, then you can update it.

## Support and Future plans

The Legacy Custom Forms plugin will be kept alive to ensure that existing legacy forms continue working without interruption, but no new features or functionality will be added.

In the future, our focus will be to enhance the security of the plugin model, mainly to restrict API calls outside the domain of the DHIS2 instance. For custom forms, we will likely introduce these restrictions in an opt-in way.

We are also planning a different modern plugin entry point, that would allow people to build custom forms that are more modern-looking, and secure by default.
...

## FAQs

-   **Are there any restrictions on custom forms using the plugin?**

The aim of the plugin is to support existing custom forms without modifications as much as possible, so there are no _explicit_ restrictions. The old forms should work out of the box unless they used hidden internals that were available in the struts app (which they shouldn’t have, anyhow).

If something doesn’t work, then you are able to update the forms and there are no explicit restrictions on the JavaScript run under the forms. There might be some _implicit_ restrictions, i.e. the CSP Headers in the newer versions of DHIS2, could block inline JavaScript, but a simple update to the form should be enough to get it working.

-   **Some custom forms are being loading using the modern app not the plugin, why?**

For custom forms that do not have JavaScript, i.e. they only contain custom HTML and CSS, we render them using the modern app by default.

If for some reason, you prefer them to be still rendered using the old styles, you can add the directive `<!-- NO_MODERN_HTML_ONLY_RENDERING -->` anywhere in the custom form code, and in that case, the Legacy Custom Form plugin will be used to render the form.

-   **Feature X used to work on the old app but not anymore**

If a feature does not work out of the box, you - as the form author - have the ability to update the form so that it works, given that there are no restrictions on the JavaScript ran on these forms. The aim of the plugin is to aim these updates, but there is no way to predict the ways people built custom forms before since everything (including using internal methods) was possible. If something is broken, and you think it's a common enough pattern that it should be supported by the plugin by default, then please get in touch and we can look at updating the plugin. But if it's a use case specific to your implementation, then you should update the forms accordingly.
