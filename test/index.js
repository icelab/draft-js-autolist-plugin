import test from 'tape'
import isFunction from 'is-function'
import createAutoListPlugin from '../src'

test('it should create a draft-js plugin', (nest) => {
  const autoListPlugin = createAutoListPlugin()

  nest.test('... with the correct methods', (assert) => {
    assert.ok(isFunction(autoListPlugin.keyBindingFn), 'keyBindingFn is a function')
    assert.ok(isFunction(autoListPlugin.handleReturn), 'handleReturn is a function')
    assert.ok(isFunction(autoListPlugin.handleKeyCommand), 'handleKeyCommand is a function')
    assert.end()
  })
})
