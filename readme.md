
### Prerequisites

<details>
  <summary>Click for details</summary>

  - [X] Checked that your issue hasn't already been filed by cross-referencing [issues with the `faq` label](https://github.com/mochajs/mocha/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3Afaq%20)
  - [X] Checked next-gen ES issues and syntax problems by using the same environment and/or transpiler configuration without Mocha to ensure it isn't just a feature that actually isn't supported in the environment in question or a bug in your code.
  - [X] 'Smoke tested' the code to be tested by running it outside the real test suite to get a better sense of whether the problem is in the code under test, your usage of Mocha, or Mocha itself
  - [X] Ensured that there is no discrepancy between the locally and globally installed versions of Mocha. You can find them with: `node node_modules/.bin/mocha --version`(Local) and `mocha --version`(Global). We recommend that you _not_ install Mocha globally.
</details>

---

### Description

- Using `opts configuration`, the [glob pattern](https://globster.xyz/) `{controllers,test}/**/*.test.js` used to expand into:
  + `controllers/**/*.test.js`
  + `test/**/*.test.js`

- Using RC configration files, this glob partten gets tokenized into invalid ones:

```
[mocha/lib/cli/options.js] > parse() > yargsParser.detailed() > result.argv.spec [ '{controllers', 'test}/**/*.test.js' ]

Warning: Cannot find any files matching pattern "{controllers"
Warning: Cannot find any files matching pattern "test}/**/*.test.js"
```

- Commenting the [**yargs** parsing option `coerce: coerceOpts`](https://github.com/mochajs/mocha/blob/master/lib/cli/options.js#L124) fixes the glob tokenization, even though it isn't a long-term fix.
- The `coerceOtps` function can be found here: https://github.com/mochajs/mocha/blob/master/lib/cli/options.js#L63

As a side I should add that these two following `spec` values give the results highlighted above
- `spec: '{controllers,test}/**/*.test.js',`
- `spec: [ '{controllers,test}/**/*.test.js' ],`

---

### Steps to Reproduce

1. Open a terminal
2. Clone the demo project using `git clone git@github.com:TheOptimisticFactory/mocha-glob-issue.git`
2. Install packages using `cd mocha-glob-issue && npm i`
4. Run any of the following scripts:

-  `npm run test-legacy-working`: Check tests passes when using lecacy opts `test/mocha.opts`
- `npm run test-bugged-baseline`: tests WONT BE FOUND when using `.mocharc.js`
- `npm run test-bugged-baseline`: Dumps the BROKEN file patterns when using `.mocha.multi-paths.js`

---

**LEGACY behavior:** [What used to happen]

<details>
  <summary>LEGACY configuration file: /test/mocha.opts</summary>

  ```javascript
  --require test/setup.js
  {controllers,test}/**/*.test.js
  --exit
  ```
</details>

`npm run test-legacy-working`

![image](https://user-images.githubusercontent.com/2607260/83260239-ba02f880-a1b9-11ea-871e-2c4619eabd34.png)

---

**Actual behavior:** [What actually happens]

<details>
  <summary>Using .mocharc.js</summary>

  ```javascript
  'use strict';

  module.exports = {
    exit: true,
    require: 'test/setup.js',
    spec: '{controllers,test}/**/*.test.js',
  };
  ```
</details>

`npm run test-bugged-baseline`

![image](https://user-images.githubusercontent.com/2607260/83260600-5deca400-a1ba-11ea-84ed-96c5698d9b01.png)

<details>
  <summary>Using .mocharc.multi-paths.js</summary>

  ```javascript
  'use strict';

  module.exports = {
    exit: true,
    require: 'test/setup.js',
    spec: [ '{controllers,test}/**/*.test.js', 'test/**/*.test.js' ],
  };
  ```
</details>

`npm run test-bugged-showcase`

![image](https://user-images.githubusercontent.com/2607260/83260968-ed925280-a1ba-11ea-9a35-45be078be6ae.png)

---

**Reproduces how often:** [What percentage of the time does it reproduce?]

About 100% of the time :)

---

### Versions

![image](https://user-images.githubusercontent.com/2607260/83262687-b5d8da00-a1bd-11ea-8cf6-c02a16a7278e.png)
