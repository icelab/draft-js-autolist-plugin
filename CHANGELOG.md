# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

# v3.0.0 2020-04-07

* Added support for draft-js v0.11.0

# v2.0.0 2017-06-19

* Update to match [method signature changes in draft-js v0.10.1](https://github.com/draft-js-plugins/draft-js-plugins/issues/736)

# v1.0.0 2017-01-30

### Fixed

* Handle changed return value behaviour for key commands in draft-js — [Thanks to @tomconroy](https://github.com/icelab/draft-js-autolist-plugin/pull/8)!

# v0.0.3 2016-07-27

### Fixed

* Add support for azerty keyboards (thanks, @grsmto!)

# v0.0.2 2016-07-25

### Fixed

* Don’t return the default key bindings if we’re not handling the event. Returning it stops any other plugins halts the callback chain, and so stops any other plugins from being able to insert behaviour.

# v0.0.1 2016-04-21

First public release
