import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { describe } from 'mocha';
import { expect } from 'chai';
import parse_rdf from '../lib/parse_rdf.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rdf = fs.realpathSync(`${__dirname}/pg132.rdf`);

describe('parse_rdf', () => {
  it('Should be a function', () => {
    expect(parse_rdf).to.be.a('function');
  });
});