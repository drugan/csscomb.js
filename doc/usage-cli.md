# Command Line usage

To run `csscombx`:

```bash
csscombx path[ path[...]]
```

`path` can be either a directory or a file:

```bash
csscombx ./my-styles public/styles.css
```

If you installed the package locally, use local bin file instead:

```bash
./node_modules/.bin/csscombx ./my-styles public/styles.css
```

## Options

### help

If you run `csscombx -h`, it will show some helpful information:

```bash
csscombx -h

  Usage: csscombx [options] <file ...>

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -v, --verbose        verbose mode
    -c, --config [path]  configuration file path
    -d, --detect         detect mode (would return detected options)
    -l, --lint           in case some fixes needed returns an error
    -t, --tty-mode       execution in TTY mode (useful, when running tool using external app, e.g. IDE)
```

### config

If you want to use custom config instead of predefined `drupal.json` just
put a file named `.csscombx.json` to project's root (see [configuration
docs](configuration.md#where-to-put-config) for more information).
However, if for some reason you would like to use custom path, do it this way:

```bash
csscombx -c path/to/config styles.css
```

### detect

If you want to generate a config file based on a template file, run:

```bash
csscombx -d example.css > .csscombx.json
```

See [configuration docs](configuration.md#generate-config-from-a-template) for
more information.

### lint

CSScomb can be used as a `--lint` or `-l` argument, i.e. telling you what should be changed instead
of modifying anything.
This option should be combined with `--verbose` or `-v` argument which is optional when
processing files with a regular ```csscombx``` command. Useful for debugging purposes.

```bash
csscombx -lv ./my-styles

good: ./my-styles/main.scss
bad: ./my-styles/main.scss
empty: ./my-styles/main.scss
invalid: ./my-styles/main.scss
now is good: ./my-styles/main.scss

4 files processed
0 files fixed
spent: 30ms
```
