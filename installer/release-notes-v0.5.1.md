# Polylux v0.5.1 — patch release

Small polish release on top of [v0.5](https://github.com/vladulus/polylux/releases/tag/v0.5.0).

### Fixed

- **AniMe Matrix clock, Bold 7 font:** the digit "1" is redrawn as a
  double-wide stem with a top flag — it now carries the same visual
  weight as the other Bold 7 digits.
- **Fresh installs get a clean default config.** The dev UI used to
  persist live settings into the bundled default config the installer
  seeds new users from; it now writes to `%APPDATA%\Polylux\polylux.yaml`
  like the installed app. Existing installs are unaffected (your config
  is never overwritten).

### Install

Download `Polylux-Setup-0.5.1.exe` and run it. It cleanly replaces any
prior version; your settings are kept. Unsigned — at the SmartScreen
prompt click "More info" → "Run anyway".

Full notes for the underlying feature set: [v0.5.0 release](https://github.com/vladulus/polylux/releases/tag/v0.5.0) · [CHANGELOG.md](https://github.com/vladulus/polylux/blob/main/CHANGELOG.md)
