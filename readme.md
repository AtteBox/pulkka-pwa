# Pulkka PWA

A simple PWA app for clocking in and out of work.

You can try the deployed "production" version here: https://main.d3bt9df6k8utdf.amplifyapp.com

## Idea
> The idea was to have a "button" on my phone that I can press when I enter work straight at the door and also when I leave work, so that I can later input the exact time to the work hours tracking system. Although there [seems to be many apps](https://buddypunch.com/blog/clock-in-clock-out-app/)  for this purpose, I decided to build my own, because it is a very basic todo-app-like idea, and there are some things I wanted to experiment with such as Progressive Web Apps (PWA) and I also wanted to try not to use any external libraries and instead rely on web standards solely.

## Features:
- clock in and clock out
- edit the time and type of the record
- clear all records (with confirmation)
- remove a record (with confirmation)
- export CSV
- record input validation
- the records are "persisted" in localStorage
- can be installed as a PWA
- works offline (service worker serving the app files)
- updates automatically at startup
- multilingual (english, finnish)
- integration tests (using the app from the parent frame)

## About the code
The aim is to not use any third party libraries such as npm packages and instead rely on web standards such as ES modules. For DX convenience the [Serve](https://github.com/vercel/serve) and [Vite](https://vitejs.dev/) npm packages are used as development servers.

## Developing
The **jsconfig.json** file and the type definitions ([TS](https://www.typescriptlang.org/) in comments) work well with [VS Code](https://code.visualstudio.com/).

You can start the development server by using Vite (which requires [Node.js](https://nodejs.org/en) by the way) by running the following command:

```
npx vite
```

Now you can test the app at http://localhost:4000. Vite's options are defined in the **vite.config.js** file. Vite allows for *hot reloading* and when developing, the [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) is not used (so that all files are served to the app straight from the server).

## Tests
The integration tests can be executed by running the development server and opening http://localhost:4000/tests/ in a browser. However notice, that this will clear the earlier stamps from that origin's localStorage on that browser.

The test code can be found in **/www/tests** and the actual test cases are located in the **main.js** file. The "pine testing framework" is just rapidly made code with the idea, that the app to be tested is used from within an iframe. The problem in that approach is that the test page URL and the testable app must be in the same origin. Therefore the tests are served with the same server and are even deployed everywhere currently with the code.

## Preparing the PWA deployment (steps 1-3)

### 1. Update the offline file list
The PWA uses an offline file list for the files which should be cached in the PWA so that it works without an internet connection. The following command creates the offline file list (execute from [Powershell](https://learn.microsoft.com/sv-se/powershell/)):
```
createOfflineFiles.ps1
```

### 2. Update the app version
The service worker gets updated if the service worker code changes and that will cause an update in the PWA installations. To make sure this will happen (so that the offline caches for the other files will be updated), update the VERSION in the www/version.js file by running the following command (using powershell):

```
incrementVersion.ps1 -IncrementType {patch | minor | major}
```

### 3. Testing the new changes with the service worker

If you want to test the app with the **service worker**, then serve the www-directory as static files with the serve package (Node is required):

```
npx serve www
```
Now you can test the app at http://localhost:3000. You can always run the integration test suite at http://localhost:3000/tests/.

Note! Never change the URL of the **serviceworker.js** file, because the existing PWA installations/instances rely on that resource/URL to always be available.

## Deploying

After the app has been prepared for deployment, the app will be deployed automatically ([AWS Amplify](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)) when merged through a PR to the main branch.
