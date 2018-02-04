import tempy from 'tempy'
import test from 'ava'
import fs from 'fs-extra'

import struc from '../'

const wait = time => (new Promise(resolve => {
	setTimeout(resolve, time)
}))

test.beforeEach(t => {
	t.context.path = tempy.directory()
})

test.afterEach(async t => {
	await fs.remove(t.context.path)
})

test('returns resolved directory', t => {
	const p = struc(t.context.path, {})

	t.is(p, t.context.path)
})

test('creates non-existent dir', async t => {
	struc(t.context.path + '/foo', {})

	t.true((await fs.stat(t.context.path + '/foo')).isDirectory())
})

test('keeps existent dir untouched', async t => {
	const before = (await fs.stat(t.context.path)).mtimeMs
	await wait(50)
	struc(t.context.path, {})
	const after = (await fs.stat(t.context.path)).mtimeMs

	t.is(before, after)
})

test('throws if dir has contents', async t => {
	await fs.writeFile(t.context.path + '/foo', 'bar')

	const err = t.throws(() => {
		struc(t.context.path, {})
	}, Error)
	t.is(err.message, 'Given path is a non-empty directory (must either be empty or non-existent)')
})

test('does nothing on empty object', async t => {
	struc(t.context.path, {})
	const dirContents = await fs.readdir(t.context.path)

	t.is(dirContents.length, 0)
})

test('single file', async t => {
	struc(t.context.path, {
		foo: 'bar'
	})

	t.is(await fs.readFile(t.context.path + '/foo', 'utf8'), 'bar')
})

test('multiple files', async t => {
	struc(t.context.path, {
		foo: 'bar',
		baz: 'zab',
		rab: 'oof'
	})

	t.is(await fs.readFile(t.context.path + '/foo', 'utf8'), 'bar')
	t.is(await fs.readFile(t.context.path + '/baz', 'utf8'), 'zab')
	t.is(await fs.readFile(t.context.path + '/rab', 'utf8'), 'oof')
})

test('single directory', async t => {
	struc(t.context.path, {
		foo: {
			bar: 'baz'
		}
	})

	t.true((await fs.stat(t.context.path)).isDirectory())
	t.is(await fs.readFile(t.context.path + '/foo/bar', 'utf8'), 'baz')
})

test('deep nested structure', async t => {
	struc(t.context.path, {
		a: 'b',
		c: {
			d: {
				e: 'f',
				g: 'h'
			},
			i: {
				j: {
					k: 'l'
				}
			},
			m: 'n'
		}
	})

	const testFile = async (p, contents) => {
		t.is(await fs.readFile(p, 'utf8'), contents)
	}

	const testDir = async p => {
		t.true((await fs.stat(p)).isDirectory())
	}

	const files = [
		['a', 'b'],
		['c/m', 'n'],
		['c/d/e', 'f'],
		['c/d/g', 'h'],
		['c/i/j/k', 'l']
	]

	const dirs = ['c', 'c/d', 'c/i', 'c/i/j']

	const filePromises = []
	for (const file of files) {
		filePromises.push(testFile(t.context.path + '/' + file[0], file[1]))
	}

	const dirPromises = []
	for (const dir of dirs) {
		dirPromises.push(testDir((t.context.path + '/' + dir)))
	}

	await Promise.all(filePromises)
	await Promise.all(dirPromises)
})
