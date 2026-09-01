const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

let binary = path.join(__dirname, 'bin', process.platform, 'texconv');
if (process.platform === 'win32') {
  binary += '.exe';
}

function texconv(opts, next) {
  assert(opts);
  assert(typeof opts.in === 'string' || opts.in instanceof Buffer);
  assert.equal(typeof opts.f, 'string');
  assert.equal(typeof opts.ft, 'string');
  opts = {
    ...opts
  };
  let file_in = opts.in;
  delete opts.in;
  let verbose = Boolean(opts.verbose);
  delete opts.verbose;

  fs.mkdtemp(path.join(os.tmpdir(), 'texconv-'), function (err, temp_dir) {
    if (err) {
      return void next(err);
    }

    function prepInput(next) {
      if (typeof file_in === 'string') {
        return void next();
      }
      let file_buf = file_in;
      file_in = path.join(temp_dir, 'input.unknown');
      fs.writeFile(file_in, file_buf, next);
    }

    prepInput(function (err) {
      if (err) {
        return void next(err);
      }
      opts.o = temp_dir;
      opts.sx = '.tmp';
      opts.nologo = true;
      opts.y = true;

      let args = [];
      for (let key in opts) {
        let v = opts[key];
        args.push(`-${key}`);
        if (v !== true) {
          args.push(v);
        }
      }
      if (process.platform !== 'win32') {
        args.push('--');
      }
      args.push(file_in);

      let basename = path.basename(file_in);
      let ext = path.extname(basename);
      let tempfile = `${basename.slice(0, -ext.length)}.tmp.${opts.ft.toLowerCase()}`;
      let outname = path.join(temp_dir, tempfile);

      function cleanup(cb) {
        fs.unlink(outname, function () {
          fs.rmdir(temp_dir, function () {
            cb();
          });
        });
      }

      let chunks = [];
      function onOutput(streamName) {
        return function (chunk) {
          chunks.push(chunk);
          if (verbose) {
            process[streamName].write(chunk);
          }
        };
      }

      let child;
      try {
        child = spawn(binary, args, { stdio: 'pipe' });
      } catch (spawn_err) {
        cleanup(function () {
          next(spawn_err);
        });
        return;
      }

      child.stdout.on('data', onOutput('stdout'));
      child.stderr.on('data', onOutput('stderr'));

      child.on('error', function (child_err) {
        child_err.output = Buffer.concat(chunks).toString('utf8');
        cleanup(function () {
          next(child_err);
        });
      });

      child.on('close', function (code) {
        let output = Buffer.concat(chunks).toString('utf8');

        if (code !== 0) {
          let exit_err = new Error(`texconv exited with code ${code}`);
          exit_err.spawn = { binary, args };
          exit_err.code = code;
          exit_err.output = output;
          fs.rmdir(temp_dir, function () {
            next(exit_err);
          });
          return;
        }

        fs.readFile(outname, function (readErr, data) {
          cleanup(function () {
            next(readErr, data);
          });
        });
      });
    });
  });
}

module.exports = texconv;
texconv.binary = binary;
