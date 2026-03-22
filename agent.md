# Agent Notes

**Important:** Always read `readme.md` before starting work on this project. It contains essential information about the project's architecture, conventions, and workflows.

## Versioning

This project uses a custom PWA versioning system. The version is defined in `www/version.js` (not `package.json`).

To bump the version, either:
- Edit `www/version.js` directly, or
- Run `./incrementVersion.ps1 -IncrementType {patch | minor | major}` (PowerShell)

The service worker uses this version to trigger PWA cache updates. Bumping the version ensures existing installations receive updated files.

## PWA Deployment Checklist

1. Update the offline file list: `./createOfflineFiles.ps1`
2. Bump the version in `www/version.js`
3. Test with service worker: `npm run preview` (serves at localhost:3000)
4. Merge to main — AWS Amplify deploys automatically
