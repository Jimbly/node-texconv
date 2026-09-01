const fs = require('fs');
const texconv = require('../');

const FILENAME = `${__dirname}/test1.png`;

console.log(`Using binary ${texconv.binary}`);
let start = Date.now();
texconv({
  in: FILENAME,
  ft: 'DDS',
  f: 'DXT1',
}, function (err, res1) {
  if (err) {
    throw err;
  }
  console.log(`From disk finished in ${Date.now() - start}ms, ${res1.length} bytes`);
  let buf = fs.readFileSync(FILENAME);
  start = Date.now();
  texconv({
    in: buf,
    ft: 'DDS',
    f: 'DXT1',
  }, function (err, res2) {
    if (err) {
      throw err;
    }
    if (res2.compare(res1) !== 0) {
      throw new Error('Results do not match')
    }
    console.log(`From mem finished in ${Date.now() - start}ms, ${res2.length} bytes, matches`);
  });

});
