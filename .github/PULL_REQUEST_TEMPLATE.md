## Thank you for contributing to Universal Viewer

<!-- We appreciate the time and effort you've put into improving Universal Viewer. Every contribution, big or small, helps make the project better for our community.

Before submitting your pull request, please take a moment to review the checklist below and **self-certify the checks you've completed**.

This is a **non-blocking checklist**, designed to help reviewers understand what has been tested, verified or updated. Tick the items you've completed and leave any that are not applicable or outstanding unchecked.

You are not expected to complete every item for every PR. If there are known limitations, outstanding issues or areas requiring further attention, please mention them in your PR description.-->

### Pull request description

**Summary of changes:**

<!-- Briefly describe what your PR changes and why.-->

**Related issues:**

<!-- Link to any related GitHub issues, discussions or feature requests.-->

### Contributor checklist

#### Accessibility & internationalisation

- [ ] **Accessibility:** Changes have been checked against [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/), with no known accessibility failures introduced.
- [ ] **Keyboard accessibility:** All new or modified interactive elements can be [operated using a keyboard](https://www.w3.org/WAI/WCAG22/Understanding/keyboard-accessible.html), with appropriate focus management and visible focus indicators.
- [ ] **Internationalisation:** Contextual language switching works correctly and all new or modified interface strings have translations available in English, Welsh, Polish, French and Swedish.

#### Compatibility & interoperability

- [ ] **IIIF compatibility:** Changes have been tested against relevant [IIIF Presentation and Image API resources](https://iiif.io/), with no known regressions in supported functionality.
- [ ] **Extension compatibility:** Changes have been checked for compatibility with existing [Universal Viewer extensions and extension points](https://github.com/UniversalViewer/universalviewer/blob/dev/manual/extensions/index.md).
- [ ] **Backwards compatibility:** Changes do not unintentionally break existing public APIs, integrations or configuration options.
- [ ] **Browser & device compatibility:** Changes have been tested across relevant supported browsers, devices and screen sizes, including responsive layouts.

#### Code quality & testing

- [ ] **Automated testing:** Relevant automated tests have been added or updated, and existing applicable tests pass.
- [ ] **Regression testing:** Existing functionality affected by the changes has been tested to ensure no unintended regressions.
- [ ] **Code quality:** Changes follow the [project's coding conventions](https://docs.universalviewer.io/), and relevant linting, formatting and type checks pass.
- [ ] **Performance:** Changes have been reviewed for potential performance impacts, with no known significant regressions.
- [ ] **Security:** Changes have been checked for potential security vulnerabilities, including unsafe handling of external data, URLs and user input.

#### Configuration & documentation

- [ ] **Configuration:** New or modified configuration options have been added to the appropriate configuration files and documented in '[manual/CONFIG.md](https://github.com/UniversalViewer/universalviewer/blob/dev/manual/CONFIG.md)`.
- [ ] **Documentation:** The repository README and any other affected documentation have been reviewed and updated where necessary.
- [ ] **User experience:** Changes have been reviewed for usability, consistency with existing interface patterns and clarity of user interactions.

### Additional notes for reviewers:

<!-- Please describe any outstanding issues, known limitations, incomplete translations, testing gaps or areas where additional feedback would be helpful.-->
