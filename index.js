'use strict'

const path = require('path')

const tempy = require('tempy')
const fs = require('fs-extra')

module.exports = (dir, structure) => {
	if (structure === null) {
		structure = dir
		dir = tempy.directory()
	}

	if (typeof dir !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof dir}`)
	}

	if (dir.length === 0) {
		throw new Error('Path string must be non-empty')
	}

	if (typeof structure !== 'object') {
		throw new TypeError(`Expected an object, got ${typeof structure}`)
	}

	dir = path.resolve(dir)

	if (fs.existsSync(dir)) {
		const stat = fs.statSync(dir)

		// Throw if not a directory
		if (!stat.isDirectory()) {
			throw new Error(`Given path exists and is not a directory`)
		}

		const children = fs.readdirSync(dir)
		if (children.length > 0) {
			throw new Error(
				'Given path is a non-empty directory ' +
				'(must either be empty or non-existent)'
			)
		}
	} else {
		fs.mkdirsSync(dir)
	}

	// Array containing files and directories to be written to in a flat manner
	//
	// Directories are represented as strings, files as arrays with their
	// first element being the path and second element being the desired
	// file contents
	const toWrite = []

	const walk = (p, obj) => {
		for (const node in obj) {
			if (Object.hasOwnProperty.call(obj, node)) {
				const value = obj[node]
				const nodeType = (() => {
					if (Array.isArray(value)) {
						return 'array'
					}

					if (value === null) {
						return 'null'
					}

					return typeof value
				})()
				const nodePath = path.join(p, node)

				if (nodeType === 'object') {
					toWrite.push(nodePath)
					walk(nodePath, value)
				} else if (nodeType === 'string') {
					toWrite.push([nodePath, value])
				} else {
					throw new TypeError('structure object can only contain keys ' +
						'and nested keys of type string or object, ' +
						`got ${nodeType}`)
				}
			}
		}
	}

	walk(dir, structure)

	for (const node of toWrite) {
		const type = typeof node

		if (type === 'string') {
			fs.mkdirSync(node)
		} else {
			fs.writeFileSync(node[0], node[1])
		}
	}

	return dir
}
