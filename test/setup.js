'use strict';

/* eslint no-console:off, node/no-unpublished-require:off, global-require:off, no-process-env:off, no-magic-numbers:off */

try {
  process.env.RETRIES_ON_FAILED_TESTS = process.env.RETRIES_ON_FAILED_TESTS || 2;

  const suiteFactory = require('@joethefkingfrypan/bk-mocha-suite');
  const chai = require('chai');
  const chalk = require('chalk');
  const config = require('config');
  const { assert } = chai;

  /* ================================================== */
  /* ||                     CHAI                     || */
  /* ================================================== */

  chai.use(require('chai-shallow-deep-equal'));
  chai.use(require('chai-subset'));
  chai.use(require('sinon-chai'));
  chai.use(require('dirty-chai'));

  chai.should();

  /* =================================================== */
  /* ||              UNHANDLED-REJECTION              || */
  /* =================================================== */

  const errorHandler = (type, err) => {
    console.error(`${chalk.redBright(`[✘] ${type}`)} - Reason: ${chalk.red(err.message || err)}`);

    if (config.DEBUG_REJECTION_STACKS) {
      console.error(chalk.red(err.stack));
    }

    const Suite = suiteFactory({
      category: 'Setup',
      method: `${type}s`,
      project: config.APP.NAME,
      service: 'Check-up',
    });

    Suite.it(`Should not have any ${type}`, () => {
      console.log(`    ${chalk.redBright(`✘ Check logs for the following markup: [✘] ${type}`)}`);
      assert.fail(err, null, `Raised failure because a ${type} has been detected`);
    });

    Suite.run();
  };

  /* =================================================== */

  process.on('unhandledRejection', err => errorHandler('Unhandled rejection', err));
  process.on('uncaughtException', err => errorHandler('Uncaught exception', err));
  process.on('multipleResolves', err => errorHandler('Multiple resolves', err));

} catch (err) {
  const { exit } = process;

  console.error(err);

  exit(1);
}
