'use strict';

// Global modules
const Suite = require('@joethefkingfrypan/bk-mocha-suite')({
  category: 'Controllers',
  service: 'Showcase',
  method: 'N/A',
});


// Project modules
const doNothing = require('../doNothing');

/* =================================================================== */
/* ||                             TESTS                             || */
/* =================================================================== */

Suite.it('Should also pass', async () => {
  const results = doNothing();

  results.should.deep.equal(true);
});

Suite.run();
