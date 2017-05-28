# Configuration

You must configure CSScomb before use.
There are a number of ways how you can do it.

## Use one of predefined configs

There are [several config
files](https://github.com/drugan/csscombx/tree/master/config)
included in this project you can use right away:

- `drupal`
- `csscomb`
- `zen`
- `yandex`

In CLI, `drupal` is a default config file that is used unless you provide your
own.
In Node.js, you can pass config's name to constructor:

```js
var Comb = require('csscombx');
var comb = new Comb('yandex');
```

Feel free to use predefined configs as examples: copy one of them and modify to
your taste.
Just remember to save the file as `.csscombx.json` in project's root.

## Create custom config

You can easily write your own configuration.
The only requirement is that config is valid JSON in order to work correctly.

Here is an example:

```json
{
    "exclude": ["node_modules/**"],
    "verbose": true,

    "always-semicolon": true,
    "color-case": "lower",
    "color-shorthand": true,
    "element-case": "lower",
    "eof-newline": true,
    "leading-zero": false,
    "quotes": "single",
    "remove-empty-rulesets": true,
    "strip-spaces": true,
    "unitless-zero": true,
    "vendor-prefix-align": true
}
```

Take a look at [available options](options.md) and choose those you need.  You can use our [visual config builder](http://csscomb.com/config) to choose most options.

### Where to put config

CSScomb will look for a file named `.csscombx.json`.
The best way is to put the file in your project's root.
However, if you want to use one config for several projects, it's fine to put
the file inside a parent folder.
CSScomb will look for a config file recursively up untill it reaches your
`HOME` directory.

Remember that you can always set custom path.
In CLI:
```bash
csscombx -c path/to/config ./my-styles/sass
```

In Node.js:
```js
var Comb = require('csscombx');
var config = require('path/to/config');
var comb = new Comb(config);
```

## Generate config from a template

Instead of configuring all the options one by one, you can use a template file:
CSScomb will detect the coding style and use it as a config.
All existing properties except `sort-order` can be configured this way:

```bash
csscombx -d example.css > .csscombx.json
```

This will create `.csscombx.json` based on options that can be detected in
`example.css` file.

Let's say your template file has following content:

```css
.foo
{
    width: #fff;
}
```

Generated config wiil then look this way:

```json
{
    "remove-empty-rulesets": true,
    "always-semicolon": true,
    "color-case": "lower",
    "color-shorthand": true,
    "strip-spaces": true,
    "eof-newline": true
}
```


## Override template's settings

You can use template inside existing config and then complete it or override
some of detected settings:

```json
{
    "template": "example.css",
    "leading-zero": false,
    "vendor-prefix-align": true
}
```

This config will:

1. detect all the options from the `example.css`,
1. then use `"leading-zero":  false` instead of anything detected,
1. then use `"vendor-prefix-align": true` even if there were no prefixed
properties or values inside the `example.css`.
