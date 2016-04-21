# Draft.js Auto-list Plugin

*This is a plugin for the [`draft-js-plugins-editor`](https://www.draft-js-plugins.com/), a plugin system that sits on top of Draft.js.*

This plugin adds support for automatic unordered/ordered list creation within [Facebook’s Draft.js editor](https://facebook.github.io/draft-js/) based on the input text. It looks something like:

![Auto-list creation in action](http://files.icelab.com.au/drops/max/1461199975-autolist-example.gif)

In short, the plugin will turn a sequence of Markdown-like lists into their actual HTML representation:

* `* ` will become an unordered list
* `- ` will become an unordered list
* `1. ` will become an ordered list
* `2. ` will become an ordered list
* `123. ` will become an ordered list

You’ll notice that the plugin also enables support for breaking out of lists like you’d expect in a WYSIWYG editor. That is, if you press "Return" on an empty list item, the current block is turned back into a standard block type.

## Usage

```js
import createAutoListPlugin from 'draft-js-autolist-plugin'
const autoListPlugin = createAutoListPlugin()
```

This can then be passed into a `draft-js-plugins-editor` component:

```js
import Editor from 'draft-js-plugins-editor'
// Within another React component
<Editor plugins={[autoListPlugin]}/>
```

## Caveats

To ensure that we aren’t _constantly_ querying the content of the editor, the plugin keeps track of the characters that are typed in order and only attempts to create a list if the full sequence matches the examples above. If make a mistake while typing a list it won’t create one. For example, the following sequence would fail (typed characters delineated by `[]`:

```
[*][m][backspace][space]
```

Even though it would _seem_ like a list should be created here (because the final visible sequence is `* `), we don’t attempt to.

## TODO

- [ ] Allow the various list regexes to be overridden.
- [ ] Add test coverage for, you know, the actual functionality within a Draft.js instance.
