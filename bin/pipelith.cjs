#!/usr/bin/env node
'use strict';

const { existsSync } = require('node:fs');
const { join } = require('node:path');
const entry = join(__dirname, '..', 'dist-cli', 'index.cjs');
if (!existsSync(entry)) {
  process.stderr.write('Pipelith CLI is not built. Run npm run build:cli first.\n');
  process.exitCode = 2;
} else {
  require(entry);
}
