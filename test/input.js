import tempy from 'tempy'
import test from 'ava'

import struc from '../'

test('input assertions', t => {
	let err

	err = t.throws(() => {
		struc({}, {})
	}, TypeError)
	t.is(err.message, 'Expected a string, got object')

	err = t.throws(() => {
		struc(struc('', {}))
	}, Error)
	t.is(err.message, 'Path string must be non-empty')

	err = t.throws(() => {
		struc(struc('foo/', 69))
	}, Error)
	t.is(err.message, 'Expected an object, got number')
})

const throwsType = (t, type, obj) => {
	const err = t.throws(() => {
		struc(tempy.directory(), obj)
	}, TypeError, `throws on ${type}`)

	t.true(err.message.endsWith(`got ${type}`))
}

test('throw if input contains illegal types', t => {
	throwsType(t, 'array', {illegal: ['TYPE']})
	throwsType(t, 'function', {illegal: () => {}})
	throwsType(t, 'number', {illegal: 69})
	throwsType(t, 'boolean', {illegal: false})
	throwsType(t, 'undefined', {illegal: undefined})
	throwsType(t, 'null', {illegal: null})
	throwsType(t, 'symbol', {illegal: Symbol('')})
})

test('throw if input contains nested illegal types', t => {
	throwsType(t, 'array', {illegal: {very: {deeply: {nested: ['ARRAY']}}}})
})
