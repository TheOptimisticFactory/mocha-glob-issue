'use strict';

// Global modules
const Suite = require('@joethefkingfrypan/bk-mocha-suite')({
  category: 'Test',
  service: 'Demo',
  method: 'N/A',
});

Suite.it('Should pass', async () => {
  return true;
});

Suite.run();
