# Polylux

A lightweight, free, open-source alternative to ASUS Armoury Crate.

Drives ROG hardware (Ryujin AIO LCD, motherboard LiveDash OLED, AniMe Matrix, Aura RGB)
without the bloat — no telemetry, no auto-updaters, no 700 MB of background services.

> Claude's project, made by Claude for you.
> If this saves your RAM and your sanity, consider donating —
> Buy Me a Coffee / GitHub Sponsors links coming with v0.1.

## Status

**Pre-alpha — under active reverse engineering.**

Currently developed and tested on:
- ROG Maximus Z690 Extreme
- ROG Ryujin II 360

Other ASUS hardware will be added as community captures arrive.

## Architecture

Plugin-based Python core. Each device family is a separate driver module.

- `polylux/drivers/ryujin_lcd/` — Ryujin II/III LCD (320×240 portrait)
- `polylux/drivers/livedash_oled/` — Maximus motherboard OLED display
- `polylux/drivers/anime_matrix/` — Maximus motherboard dot matrix
- `polylux/drivers/aura_rgb/` — Aura RGB (delegates to OpenRGB)
- `polylux/render/` — image/animation/text composition pipeline
- `polylux/stats/` — system stat collectors (CPU, GPU, RAM, fans, temps)
- `polylux/service/` — Windows service mode + auto-start

## License

MIT. See `LICENSE`.
