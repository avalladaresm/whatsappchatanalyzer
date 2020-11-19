# Changelog
This is my first time doing a changelog, so I will try it to keep it plain and simple.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



## [Planned features]
- WhatsApp for iOS exported chats support
- Group chats
- A bit more graphs, don't know what will be displayed yet...
- Dashboard JPG/PNG export
- Chat view
    - View messages per day or ranges of days
- Search for word/phrase in the chat, and display when those results ocurred
- Whatever comes to my mind later...

## [Bugs]
- On the Messages per person per day graph, labels are not displayed correctly when using the Mayre component
- System messages in chat such as `<Sender name> security code changed. Tap for more info.` and `Messages to this chat and calls are now secured with end-to-end encryption. Tap for more info.` are not supported yet, so if your exported chat file has them, the file will not be loaded.
- Chat view doesn't show separation between days
- Date updating while scrolling on chat view's modal title only works when opened for the first time after setting a new date range. If modal is closed and opened again without changing the date range, the last date stored in the state will be displayed, not updating while scrolling.
- Calendar heatmap is not responsive yet

## [0.0.2] - 2020-06-01
### Added
- Chat view
- Radio buttons for graphs

## [0.0.1] - 2020-05-31
### Added
- Initial release, pre-alpha version probably?
- Chats exported from WhatsApp for Android can be loaded
- Graphs showing total messages overtime and messages per person
- Support for 2-person chats
- Calendar decoration showing which days the user messaged to other person

[0.0.2]: https://github.com/avalladaresm/whatsappchatanalyzer/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/avalladaresm/whatsappchatanalyzer/releases/tag/v0.0.1