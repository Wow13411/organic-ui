# Release Guide

This guide explains how to manually publish the `organic-ui` package to npm.

## Prerequisites

1. **npm account**: You need an npm account with publish permissions
2. **Authentication**: Log in to npm using:
   ```bash
   npm login
   ```

## Publishing Steps

### 1. Update Version

Edit `packages/organic-ui/package.json` and update the version number following [semantic versioning](https://semver.org/):
- **Patch** (1.0.x): Bug fixes and minor changes
- **Minor** (1.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

Example:
```json
{
  "version": "1.0.1"
}
```

### 2. Commit Version Change

```bash
git add packages/organic-ui/package.json
git commit -m "chore: bump version to 1.0.1"
git tag v1.0.1
git push origin main --tags
```

### 3. Publish to npm

From the repository root, run:

```bash
pnpm publish
```

This will publish the `organic-ui` package to npm with public access.

### 4. Verify Publication

Check that the package is available:
```bash
npm view organic-ui
```

Or visit: https://www.npmjs.com/package/organic-ui

## Troubleshooting

- **Authentication error**: Run `npm login` again
- **Version already exists**: Update the version number in package.json
- **Permission denied**: Ensure you have publish rights for the package
- **Package name taken**: Consider scoping the package (e.g., `@yourname/organic-ui`)

## Notes

- The package is published with `--access public` to ensure it's publicly available
- No build step is required as the package uses source files directly
- Always test the package locally before publishing using `pnpm link`
