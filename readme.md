# struc [![Travis build](https://travis-ci.org/nikersify/struc.svg?branch=master)](https://travis-ci.org/nikersify/struc) [![AppVeyor build](https://ci.appveyor.com/api/projects/status/f6bhfklqk61bnqrc?svg=true)](https://ci.appveyor.com/project/nikersify/struc)

> Create file/dir structures on disk from plain js objects


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

Path to the target directory the structure will be placed inside of.
The directory Will be created if doesn't exist, otherwise must be an empty
directory.

#### structure

Type: `Object`

A file/directory representation, object keys represent paths, object values
must be of type `Object` or `String` (`Array` isn't allowed). An `Object`
represents a directory with its keys being other files/directories, while `String`
represents a file with contents being the `String` itself.


## License

MIT © [nikersify](https://nikerino.com)
