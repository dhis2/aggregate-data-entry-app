# About custom forms

## History

The predecessor of this React app was part of a monolithic hybernate/struts MVC application. The page contained many stylesheets and JavaScript files. Since custom-forms can contain arbitrary HTML, CSS and JavaScript, and because they are rendered into a page which contained a lot of assets, custom forms have been created over time which may rely on:

-   JavaScript libraries included in the page
-   Stylesheets included in the page
-   Custom JavaScript helpers included in the page, most notably the `window.dhis2` object
-   HTML elements in the main page (not in the custom form HTML) to be present.

## Challenge

Now that DHIS2 Core is moving away from struts and is using React to build SPAs which replace the various struts based pages, the situation has changed significantly. None of these global assets are available to the custom forms and the expected surrounding elements are gone too. We have explored ways to guarantee full backwards compatibility for existing custom forms, but have reached the conclusion that there is no sane way to do so.

## The future

With no way to guarantee full backwards compatibility we have come up with a different general approach to offer custom forms functionality:

-   For v1, custom forms can still be made in the traditional way, i.e. by using the WYSIWYG editor in the Maintenance App or hand-coding the HTML file. However, when using this method, the following limitations apply:
    -   Adding logic/JavaScript to these custom forms is no longer supported at all.
    -   Adding styles to the custom forms themselves is still partially supported, but no helper classes are available, and the app will apply some styles to the forms as well.
-   In the next version of the app we will also add support for plugins. This will essentially allow developers to build custom react "micro-apps" for their specific use-case. We will also offer a set of React components that make it easier to develop these custom forms, and a method of requesting data from/via the main app.

## V1 implementation

We process custom forms as follows:

-   We fetch the custom forms HTML (produced by the WYSIWYG editor or hand coded)
-   We parse the HTML string to react components, where we and do some replacements:
    -   input elements are replaced by the components we use for default/section forms
    -   some table cells are cleared of invisible characters and other table cells get an additional class name, both to get the custom forms table styles to match the default/section forms
    -   script tags are removed
-   We render the parsed HTML directly into the main app (not an iframe)

### Known limitations

The v1 implementation has a fair amount of limitations:

-   No custom logic (JavaScript) is allowed, it will not work because we strip the script tags
-   Custom forms can't inherit style from the main page
-   Global styles defined in the custom form HTML could bleed out to the main app and affect its appearance
-   We have chosen to have the custom form styles to emulate the custom/default forms. This decision was taken to be in line with how the tracker-capture team processes custom forms. For the data-entry app this means that we implicitly assume the inputs are in table cells.
