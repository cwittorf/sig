#!/usr/bin/env node
// Courtesy of leo
var path = require('path');
var fs = require('fs');
var program = require('commander');
var colors = require('colors');
var nodeZip = require('node-zip');
var aws = require("aws-sdk");
var lambda = new aws.Lambda({
  region: 'us-east-1'
});

//Build Stuff
var browserify = require('browserify');
// var babelify = require('babelify');

program
  .version('0.0.1')
  .arguments('<dir>')
  .usage('<dir> [options]')
  .action(function (dir) {
    var rootDir = path.resolve(process.cwd(), "./" + dir);
    var pkg = require(path.resolve(rootDir, "package.json"));
    var config = pkg;

    var funcDetails = {
      FunctionName: config.name,
      Handler: "index." + config.handler,
      Role: config.role,
      Runtime: "nodejs4.3",
      Description: pkg.description,
      MemorySize: config.memory,
      Timeout: config.timeout,
      Publish: true
    };

    var zip = nodeZip();

    var b = browserify({
      standalone: 'lambda',
      bare: true,
      browserField: false,
      builtins: false,
      commondir: false,
      detectGlobals: true,
      insertGlobalVars: {
        process: function () {
          return;
        }
      }
    });
    b.external("aws-sdk");
    b.add(path.resolve(rootDir, "index.js"));
    var out = fs.createWriteStream("/tmp/lambdabuild.js");
    out.on('finish', function () {
      zip.file("index.js", fs.readFileSync("/tmp/lambdabuild.js"));
      fs.writeFileSync('/tmp/test.zip', zip.generate({
        base64: false,
        compression: 'DEFLATE'
      }), 'binary');
      funcDetails.Code = {
        ZipFile: fs.readFileSync('/tmp/test.zip')
      };
      lambda.createFunction(funcDetails, function (err, data) {
          console.log(err);
        if (err && err.code == "ResourceConflictException") { //file already exists, lets just update the code.
          console.log("Updating Function");
          lambda.updateFunctionCode({
            FunctionName: funcDetails.FunctionName,
            Publish: true,
            ZipFile: fs.readFileSync('/tmp/test.zip')
          }, function (err, data) {
            console.log(err, data);
          });
        } else {
          console.log(data);
        }
      });
    });
    b.bundle().pipe(out);
  })
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp(colors.red);
}
