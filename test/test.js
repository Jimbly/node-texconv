const texconv = require('../');

console.log(`Using binary ${texconv.binary}`);
let start = Date.now();
texconv({
  in: `${__dirname}/test1.png`,
  ft: 'DDS',
  f: 'DXT1',
}, function (err, res) {
  if (err) {
    throw err;
  }
  console.log(`Finished in ${Date.now() - start}ms, ${res.length} bytes`);
});
