# struc [![Build Status](https://travis-ci.org/nikersify/struc.svg?branch=master)](https://travis-ci.org/nikersify/struc)

> Create file/dir structures from plain js objects on disk

Most useful in testing while combined with [tempy](https://github.com/sindresorhus/tempy).


## Install

```
$ npm install struc
```


## Usage

The following input:

```js
const struc = require('struc');

struc('path/', {
	'file': 'file contents',
	'directory': {
		'another-file': 'with stuff inside!',
		'empty-dir': {}
	}
});
```

...would place the following files/directories on disk:

```
path/file: "file contents"
path/directory/another-file: "with stuff inside"
path/directory/empty-dir/
```


## API

### struc([path], structure)

Returns the absolute resolved path.

#### path

Type: `String`<br>
Default: `tempy.directory()`

Path to the target directory the structure will be placed inside of. Will be created if doesn't exist, otherwise must be an empty directory.

#### structure

Type: `Object`

A file/directory representation, keys represent paths and all values of the object must be of type `object` or `string` (`array` isn't allowed). An `object` represents a directory its keys being other files/directories, while `string` represents a file with contents being the `string` itself.


## License

MIT © [nikersify](https://nikerino.com)
