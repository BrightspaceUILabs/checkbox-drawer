# @brightspace-ui-labs/checkbox-drawer

[![NPM version](https://img.shields.io/npm/v/@brightspace-ui-labs/checkbox-drawer.svg)](https://www.npmjs.org/package/@brightspace-ui-labs/checkbox-drawer)

> Note: this is a ["labs" component](https://github.com/BrightspaceUI/guide/wiki/Component-Tiers). While functional, these tasks are prerequisites to promotion to BrightspaceUI "official" status:
>
> - [ ] [Design organization buy-in](https://github.com/BrightspaceUI/guide/wiki/Before-you-build#working-with-design)
> - [ ] [design.d2l entry](http://design.d2l/)
> - [ ] [Architectural sign-off](https://github.com/BrightspaceUI/guide/wiki/Before-you-build#web-component-architecture)
> - [ ] [Continuous integration](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-continuously-with-travis-ci)
> - [ ] [Cross-browser testing](https://github.com/BrightspaceUI/guide/wiki/Testing#cross-browser-testing-with-sauce-labs)
> - [ ] [Unit tests](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-with-polymer-test) (if applicable)
> - [ ] [Accessibility tests](https://github.com/BrightspaceUI/guide/wiki/Testing#automated-accessibility-testing-with-axe)
> - [ ] [Visual diff tests](https://github.com/BrightspaceUI/visual-diff)
> - [ ] [Localization](https://github.com/BrightspaceUI/guide/wiki/Localization) with Serge (if applicable)
> - [ ] Demo page
> - [ ] README documentation

The `d2l-labs-checkbox-drawer` element can be used to get a checkbox with a description. When checked, drawer contents are revealed underneath.

## Installation

Install from NPM:

```shell
npm install @brightspace-ui-labs/checkbox-drawer
```

## Usage

```html
<script type="module">
    import '@brightspace-ui-labs/checkbox-drawer/checkbox-drawer.js';
</script>
<d2l-labs-checkbox-drawer>
  <p>My drawer content.</p>
</d2l-labs-checkbox-drawer>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `aria-label` | String | Provides context for the component. Must be used if `label` is not used. Cannot be used with `label`. |
| `checked` | Boolean | True if the checkbox is checked. False if not checked. |
| `description` | String | Extra information that is displayed beneath the `label`. Optionally used when `label` is used. Cannot be used with `aria-label`. |
| `label` | String | Provides visible information about the component. Must be used if `aria-label` is not used. Cannot be used with `aria-label`. |

**Accessibility:**

To make your usage of `d2l-labs-checkbox-drawer` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| `aria-label` | Provides context for the component. Must be used if `label` is not used. Cannot be used with `label`. |

**Events:**

- `d2l-checkbox-drawer-checked-change`: dispatched when checkbox's state changes.
- `d2l-checkbox-drawer-expand`: dispatched when the drawer starts to expand. As per the [expand collapse component](https://github.com/BrightspaceUI/core/tree/master/components/expand-collapse), the `detail` contains an `expandComplete` promise that can be waited on to determine when the content has finished expanding.
- `d2l-checkbox-drawer-collapse`: dispatched when the drawer starts to collapse. As per the [expand collapse component](https://github.com/BrightspaceUI/core/tree/master/components/expand-collapse), the `detail` contains a `collapseComplete` promise that can be waited on to determine when the content has finished collapsing.

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

### Linting

```shell
# eslint and lit-analyzer
npm run lint

# eslint only
npm run lint:eslint
```

### Testing

```shell
# lint & run headless unit tests
npm test

# unit tests only
npm run test:headless

# debug or run a subset of local unit tests
# then navigate to `http://localhost:9876/debug.html`
npm run test:headless:watch
```

### Running the demos

To start an [es-dev-server](https://open-wc.org/developing/es-dev-server.html) that hosts the demo page and tests:

```shell
npm start
```

## Versioning & Releasing

> TL;DR: Commits prefixed with `fix:` and `feat:` will trigger patch and minor releases when merged to `master`. Read on for more details...

The [sematic-release GitHub Action](https://github.com/BrightspaceUI/actions/tree/master/semantic-release) is called from the `release.yml` GitHub Action workflow to handle version changes and releasing.

### Version Changes

All version changes should obey [semantic versioning](https://semver.org/) rules:
1. **MAJOR** version when you make incompatible API changes,
2. **MINOR** version when you add functionality in a backwards compatible manner, and
3. **PATCH** version when you make backwards compatible bug fixes.

The next version number will be determined from the commit messages since the previous release. Our semantic-release configuration uses the [Angular convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) when analyzing commits:
* Commits which are prefixed with `fix:` or `perf:` will trigger a `patch` release. Example: `fix: validate input before using`
* Commits which are prefixed with `feat:` will trigger a `minor` release. Example: `feat: add toggle() method`
* To trigger a MAJOR release, include `BREAKING CHANGE:` with a space or two newlines in the footer of the commit message
* Other suggested prefixes which will **NOT** trigger a release: `build:`, `ci:`, `docs:`, `style:`, `refactor:` and `test:`. Example: `docs: adding README for new component`

To revert a change, add the `revert:` prefix to the original commit message. This will cause the reverted change to be omitted from the release notes. Example: `revert: fix: validate input before using`.

### Releases

When a release is triggered, it will:
* Update the version in `package.json`
* Tag the commit
* Create a GitHub release (including release notes)
* Deploy a new package to NPM

### Releasing from Maintenance Branches

Occasionally you'll want to backport a feature or bug fix to an older release. `semantic-release` refers to these as [maintenance branches](https://semantic-release.gitbook.io/semantic-release/usage/workflow-configuration#maintenance-branches).

Maintenance branch names should be of the form: `+([0-9])?(.{+([0-9]),x}).x`.

Regular expressions are complicated, but this essentially means branch names should look like:
* `1.15.x` for patch releases on top of the `1.15` release (after version `1.16` exists)
* `2.x` for feature releases on top of the `2` release (after version `3` exists)
