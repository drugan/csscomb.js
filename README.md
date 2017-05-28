# CSScomb [![CSSComb](logo.png)](http://csscomb.com/)
[![Build Status](https://travis-ci.org/drugan/csscombx.svg?branch=master)](http://travis-ci.org/drugan/csscombx)
[![NPM version](https://badge.fury.io/js/csscomb.svg)](http://badge.fury.io/js/csscomb)
[![Dependency Status](https://david-dm.org/drugan/csscombx.svg)](https://david-dm.org/drugan/csscombx)
[![devDependency Status](https://david-dm.org/drugan/csscombx/dev-status.svg)](https://david-dm.org/drugan/csscombx#info=devDependencies)

The current fork of the CSScombx coding style formatter is specifically intended to comply
with the [Drupal CMS coding standards](https://www.drupal.org/docs/develop/standards/css/csscomb-settings-for-drupal-css-formatting-and-sort-tool). The default configuration might be found in the **config/drupal.json** file.
You can easily write your own [configuration](doc/configuration.md) to make
your style sheets beautiful and consistent. Just copy some of the **config/\*.json** files,
put it into your project's root and rename the file to **.csscombx.json** (see the leading dot).
Then edit the file according your needs. Note that any of a project child folders
may have its own **.csscombx.json** file with different settings.

The main feature is [sorting properties](doc/options.md#sort-order) in a specific order.
It was inspired by [@miripiruni](https://github.com/miripiruni)'s
[PHP-based tool](https://github.com/csscomb/csscomb) of the same name.
This is the new JavaScript version, based on the powerful CSS parser
[Gonzales PE](https://github.com/tonyganch/gonzales-pe).

## 0. Maintenance mode

The tool has a restricted support on the current fork.

If you'd like to become a maintainer of this project, please ping
[@drugan](https://github.com/drugan).

## 1. Install

Global installation (for use as a command-line tool):

```bash
npm install csscombx -g
```

Local installation (for use as a command-line tool within current directory):

```bash
npm install csscombx
```

To install as a project dependency (the package will appear in your dependencies):

```bash
npm install csscombx --save
```

To install as a dev dependency (the package will appear in your devDependencies):

```bash
npm install csscombx --save-dev
```

## 2. [Configure](doc/configuration.md)

There are a number of ways to configure CSScomb:

- Use one of [predefined configs](config)
- Put **.csscombx.json** file in the project root or any of the nested folders.
- Set path to config's file
- Use **\*.css** file as a template

## 3. Use

### [Command Line](doc/usage-cli.md)

Process all **\*.css**, **\*.scss**, **\*.sass** or **\*.less** files found in the **./my-styles** folder
or any of its child folders.

```bash
csscombx ./my-styles
```

### [Node.js module](doc/usage-node.md)

Process files like the above using **config/zen.json** configuration file.

```js
var Comb = require('csscombx');
var comb = new Comb('zen');
comb.processPath('./my-styles');
```

## 4. Contribute

Anyone and everyone is welcome to contribute.
Please take a moment to review the [guidelines for contributing](CONTRIBUTING.md).

## Authors

[@mishanga](https://github.com/mishanga),
[@tonyganch](https://github.com/tonyganch)

Thanks for assistance and contributions:

[@miripiruni](https://github.com/miripiruni),
[@anton-rudeshko](https://github.com/anton-rudeshko),
[@cvrebert](https://github.com/cvrebert),
[@filtercake](https://github.com/filtercake),
[@ignovak](https://github.com/ignovak),
[@kizu](https://github.com/kizu),
[@lefoy](https://github.com/lefoy),
[@L0stSoul](https://github.com/L0stSoul),
[@mishaberezin](https://github.com/mishaberezin),
[@puzankov](https://github.com/puzankov),
[@schneyra](https://github.com/schneyra),
[@thejameskyle](https://github.com/thejameskyle),
[@vecmezoni](https://github.com/vecmezoni)
[@drugan](https://github.com/drugan)

## License

This software is released under the terms of the
[MIT license](https://github.com/drugan/csscombx/blob/master/LICENSE).

## Other projects
* https://github.com/senchalabs/cssbeautify
* https://github.com/css/gonzales
* https://github.com/tonyganch/gonzales-pe
* https://github.com/css/csso
* https://github.com/nzakas/parser-lib
