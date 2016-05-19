<!--[CN_HEADING]-->
# Contributing

Welcome! This document explains how you can contribute to making **angular-form-lib** even better.


<!--[]-->

<!--[CN_GETTING_STARTED]-->
# Getting Started

## Installation

```
git clone <this repo>
npm install
```


<!--[]-->

<!--[CN_GITFLOW_PROCESS]-->
# GitFlow Development Process

This project uses the [GitHub Flow](https://guides.github.com/introduction/flow/index.html) workflow.

## Create a branch
When you're working on a project, you're going to have a bunch of different features or ideas in progress at any given time – some of which are ready to go, and others which are not. Branching exists to help you manage this workflow.

When you create a branch in your project, you're creating an environment where you can try out new ideas. Changes you make on a branch don't affect the `master` branch, so you're free to experiment and commit changes, safe in the knowledge that your branch won't be merged until it's ready to be reviewed by someone you're collaborating with.

###ProTip

Branching is a core concept in Git, and the entire GitHub Flow is based upon it. There's only one rule: anything in the `master` branch is always deployable.

Because of this, it's extremely important that your new branch is created off of `master` when working on a feature or a fix. Your branch name should be descriptive (e.g., `refactor-authentication`, `user-content-cache-key`, `make-retina-avatars`), so that others can see what is being worked on.

## Add commits
Once your branch has been created, it's time to start making changes. Whenever you add, edit, or delete a file, you're making a commit, and adding them to your branch. This process of adding commits keeps track of your progress as you work on a feature branch.

Commits also create a transparent history of your work that others can follow to understand what you've done and why. Each commit has an associated commit message, which is a description explaining why a particular change was made. Furthermore, each commit is considered a separate unit of change. This lets you roll back changes if a bug is found, or if you decide to head in a different direction.

###ProTip

Commit messages are important, especially since Git tracks your changes and then displays them as commits once they're pushed to the server. By writing clear commit messages, you can make it easier for other people to follow along and provide feedback.

## Open a pull request

Pull Requests initiate discussion about your commits. Because they're tightly integrated with the underlying Git repository, anyone can see exactly what changes would be merged if they accept your request.

You can open a Pull Request at any point during the development process: when you have little or no code but want to share some screenshots or general ideas, when you're stuck and need help or advice, or when you're ready for someone to review your work. By using GitHub's @mention system in your Pull Request message, you can ask for feedback from specific people or teams, whether they're down the hall or ten time zones away.

###ProTip

Pull Requests are useful for contributing to open source projects and for managing changes to shared repositories. If you're using a Fork & Pull Model, Pull Requests provide a way to notify project maintainers about the changes you'd like them to consider. If you're using a Shared Repository Model, Pull Requests help start code review and conversation about proposed changes before they're merged into the `master` branch.

## Discuss and review your code
Once a Pull Request has been opened, the person or team reviewing your changes may have questions or comments. Perhaps the coding style doesn't match project guidelines, the change is missing unit tests, or maybe everything looks great and props are in order. Pull Requests are designed to encourage and capture this type of conversation.

You can also continue to push to your branch in light of discussion and feedback about your commits. If someone comments that you forgot to do something or if there is a bug in the code, you can fix it in your branch and push up the change. GitHub will show your new commits and any additional feedback you may receive in the unified Pull Request view.

###ProTip

Pull Request comments are written in Markdown, so you can embed images and emoji, use pre-formatted text blocks, and other lightweight formatting.

## Merge to `master`

Once your PR has passed any the integration tests and received approval to merge, it is time to merge your code into the `master` branch.

Once merged, Pull Requests preserve a record of the historical changes to your code. Because they're searchable, they let anyone go back in time to understand why and how a decision was made.

###ProTip

By incorporating certain keywords into the text of your Pull Request, you can associate issues with code. When your Pull Request is merged, the related issues are also closed. For example, entering the phrase Closes #32 would close issue number 32 in the repository. For more information, check out our help article.


<!--[]-->

<!--[CN_BUILD_TASKS]-->
## Build Tasks

Command | Description
:------ | :----------
<pre>npm run build</pre> | Generate production build into [dist/](dist/) folder
<pre>npm run build:serve</pre> | Generate production build and serve on **https://localhost:4000**'
<pre>npm run dev</pre> | Run project in development mode (verify code, create dev build into dev/ folder, serve on **https://localhost:4000**, watch for changes and reload the browser automatically)
<pre>npm start</pre> | Alias for `npm run dev` task
<pre>npm run build:dev</pre> | Create a development build using Webpack<ul><li>Sourcemaps</li><li>Hot reloading of source code</li></ul>
<pre>npm run build:prod</pre> | Create a production build using Webpack<ul><li>Minifies source code</li><li>Sourcemaps</li><li>Dead code removal</li><li>Hashes added to file names for cache-busting</li></ul>



<!--[]-->

<!--[CN_TEST_TASKS]-->
## Test Tasks

Command | Description
:------ | :----------
<pre>npm test</pre> | Alias for `npm run test:unit` task
<pre>npm run test:unit</pre> | Run unit tests whenever JS source or tests change<ul><li>Uses Karma and Jasmine 2</li><li>Code coverage</li><li>Runs continuously (best to run in a separate window)</li></ul>
<pre>npm run test:unit:debug</pre> | Run unit tests but disable code coverage to make debugging in a browser easier<ul><li>no code coverage to make it easier to read source code</li></ul>
<pre>npm run test:unit:once</pre> | Run unit tests once
<pre>npm run test:browser</pre> | Run browser tests against the *development* web server (the development server **must** be running)



<!--[]-->

<!--[CN_VERIFY_TASKS]-->
## Verification (Linting) Tasks

Command | Description
:------ | :----------
<pre>npm run verify</pre> | Verify JS & CSS code style and syntax<ul><li>Verifies source *and test code* (unlike Webpack loaders)</li></ul>
<pre>npm run verify:watch</pre> | Runs verify task whenever JS or CSS code is changed



<!--[]-->

<!--[CN_COMMIT_TASKS]-->
## Commit Tasks

Command | Description
:------ | :----------
<pre>git status</pre> | Lists the current branch and the status of changed files
<pre>git log</pre> | Displays the commit log (press Q to quit viewing)
<pre>git add .</pre> | Stages all modified & untracked files, ready to be committed
<pre>git cz</pre> | Commit changes to local repository using Commitizen<ul><li>Asks questions about the change to generate a valid conventional commit message</li><li>Can be customised by modifying [config/release/commitMessageConfig.js](config/release/commitMessageConfig.js)</li></ul>
<pre>git push</pre> | Push local repository changes to remote repository


<!--[]-->

<!--[CN_RELEASE_TASKS]-->
## Release Tasks

Command | Description
:------ | :----------
<pre>npm run release</pre> | Create production version of software, verify code, run unit tests. This task is designed to be run before
the `semantic-release` task.
<ul><li>Run `semantic-release-cli setup` once you have a remote repository. See https://github.com/semantic-release/cli for details</li><li>Generates release notes against each release in the "Releases" section in GitHub</li><li>Publishes package to NPM</li><li>Integrates with Travis CI</li></ul>



<!--[]-->


<!--[CN_CHANGING_BUILD_TOOL_CONFIG]-->
## Changing build-tool configuration

There are 3 ways you can change the build-tool configuration for this project:

1. BEST: Modify the Confit configuration file ([confit.json](confit.json)) by hand, then re-run `yo confit` and tell it to use the existing configuration.
1. OK: Re-run `yo confit` and provide new answers to the questions. **Confit will attempt to overwrite your existing configuration (it will prompt for confirmation), so make sure you have committed your code to a source control (e.g. git) first**.
  There are certain configuration settings which can **only** be specified by hand, in which case the first approach is still best.
1. RISKY: Modify the generated build-tool config by hand. Be aware that if you re-run `yo confit` it will attempt to overwrite your changes. So commit your changes to source control first.

Additionally, the **currently-generated** configuration can be extended in the following ways:

- The task configuration is defined in [package.json](package.json). It is possible to change the task definitions to add your own sub-tasks.
You can also use the `pre...` and `post...` script-name prefixes to run commands before (pre) and after (post) the generated commands.

- The `buildJS.frameworkScripts` array in [confit.json](confit.json) contains framework-specific scripts, and should not be modified. If a sample project is generated, the additional framework scripts needed by the sample app will also appear here. This property will be overwritten **every time** Confit is run.

- The `buildJS.vendorScripts` array in [confit.json](confit.json) is designed to be edited manually. This property should contain NPM module names and/or references to JavaScript files (files must start with `./`). For example: `vendorScripts: ['jquery', './module/path/to/jsFile.js', 'moment/timezone',  ...]`

- The `entryPoint.entryPoints` object in [confit.json](confit.json) is designed to be edited manually. It represents the starting-point(s) of the application (like a `main()` function). Normally an application has one entry point, but it is possible to have more than one. `entryPoint.entryPoints` must have at-least one property (e.g. `property: [file]`), where `file` is a list of NPM module names and/or references to JavaScript files (file references must start with `./`);

- `npm start` can be extended by modifying [config/webpack/dev.webpack.config.js](config/webpack/dev.webpack.config.js) and [config/webpack/prod.webpack.config.js](config/webpack/prod.webpack.config.js). Confit will attempt to overwrite the contents files the next time `yo confit` is run, so make sure any modifications are committed to source control first.

- `npm run test:browser` can be extended by modifying [config/testBrowser/protractor.conf.js](config/testBrowser/protractor.conf.js). This task uses Protractor to run Jasmine2 test specs (located in `src/modules/**/browserTest/`) against the development web server URL.

- `npm test:unit` can be extended by modifying [config/testUnit/karma.conf.js](config/testUnit/karma.conf.js) and [config/testUnit/karma.common.js](config/testUnit/karma.common.js). [config/testUnit/test.files.js](config/testUnit/test.files.js) is generated from the entry points in the Confit configuration. It is **best** to modify the entry points in [confit.json](confit.json) then re-run `yo confit`.
Note that it is possible to run a subset of unit tests by passing a command line argument to Karma, and then modifying the `testFilesRegEx` variable in [config/testUnit/karma.common.js](config/testUnit/karma.common.js) to refer to the command line argument value. For example, if the command is `...karma.conf.js --spec=testb`, then `karma.common.js` can access this value through `process.argv.indexOf('--spec=testb')`, which can then be used to change the default value of `testFilesRegEx`.




<!--[]-->



