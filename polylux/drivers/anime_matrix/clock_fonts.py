"""Bitmap fonts purpose-built for the AniMe Matrix 7-LED short axis.

TTF rendering through PIL fights the 7-row constraint at every step
(Pixelya needs size 9 to look right, Arial Bold needs auto-shrink,
etc.). These fonts are pixel-defined for the exact panel dimensions,
so what you see in the preview is what lights up on the panel —
no scaling, no anti-alias, no font-metric guessing.

Each font defines the glyphs needed for a clock readout (``0-9`` and
``:``). Width is per-glyph; height is the font's constant
``height`` (matches the matrix short axis).

Add a font by appending to ``CLOCK_FONTS``. The UI dropdown is fed
directly from that dict.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable


_ON = "#"   # lit pixel
_OFF = "."  # dark pixel


@dataclass
class BitmapFont:
    name: str
    height: int                # pixel rows (matches matrix short axis)
    spacing: int               # blank cols between glyphs
    glyphs: dict[str, list[str]]   # char -> list of rows ('#'=on, '.'=off)

    def has(self, ch: str) -> bool:
        return ch in self.glyphs

    def width(self, ch: str) -> int:
        rows = self.glyphs.get(ch)
        if not rows:
            return 0
        return max(len(r) for r in rows)

    def text_size(self, text: str) -> tuple[int, int]:
        total_w = 0
        chars = [c for c in text if c in self.glyphs]
        for i, ch in enumerate(chars):
            total_w += self.width(ch)
            if i < len(chars) - 1:
                total_w += self.spacing
        return total_w, self.height

    def iter_pixels(self, text: str) -> Iterable[tuple[int, int]]:
        """Yield (x, y) lit-pixel positions for ``text`` at origin (0, 0)."""
        x_cursor = 0
        chars = [c for c in text if c in self.glyphs]
        for i, ch in enumerate(chars):
            rows = self.glyphs[ch]
            w = self.width(ch)
            for y, row in enumerate(rows):
                for x, px in enumerate(row):
                    if px == _ON:
                        yield (x_cursor + x, y)
            x_cursor += w
            if i < len(chars) - 1:
                x_cursor += self.spacing


# ---------------------------------------------------------------------------
# Font 1 — "Bold 7"
# 5 wide × 7 tall block digits; thick strokes; reads from across the room.
# ---------------------------------------------------------------------------

BOLD_7 = BitmapFont(
    name="Bold 7",
    height=7,
    spacing=1,
    glyphs={
        "0": [
            ".###.",
            "##.##",
            "##.##",
            "##.##",
            "##.##",
            "##.##",
            ".###.",
        ],
        "1": [
            "..#..",
            ".##..",
            "..#..",
            "..#..",
            "..#..",
            "..#..",
            ".###.",
        ],
        "2": [
            ".###.",
            "##.##",
            "...##",
            "..##.",
            ".##..",
            "##...",
            "#####",
        ],
        "3": [
            ".###.",
            "##.##",
            "...##",
            "..##.",
            "...##",
            "##.##",
            ".###.",
        ],
        "4": [
            "...##",
            "..###",
            ".####",
            "##.##",
            "#####",
            "...##",
            "...##",
        ],
        "5": [
            "#####",
            "##...",
            "####.",
            "...##",
            "...##",
            "##.##",
            ".###.",
        ],
        "6": [
            ".###.",
            "##.##",
            "##...",
            "####.",
            "##.##",
            "##.##",
            ".###.",
        ],
        "7": [
            "#####",
            "...##",
            "..##.",
            "..##.",
            ".##..",
            ".##..",
            ".##..",
        ],
        "8": [
            ".###.",
            "##.##",
            "##.##",
            ".###.",
            "##.##",
            "##.##",
            ".###.",
        ],
        "9": [
            ".###.",
            "##.##",
            "##.##",
            ".####",
            "...##",
            "##.##",
            ".###.",
        ],
        ":": [
            ".",
            ".",
            "#",
            ".",
            "#",
            ".",
            ".",
        ],
    },
)


# ---------------------------------------------------------------------------
# Font 2 — "Slim 7"
# 3 wide × 7 tall; thin strokes; fits more digits side-by-side.
# ---------------------------------------------------------------------------

SLIM_7 = BitmapFont(
    name="Slim 7",
    height=7,
    spacing=1,
    glyphs={
        "0": [
            ".#.",
            "#.#",
            "#.#",
            "#.#",
            "#.#",
            "#.#",
            ".#.",
        ],
        "1": [
            ".#.",
            "##.",
            ".#.",
            ".#.",
            ".#.",
            ".#.",
            "###",
        ],
        "2": [
            ".#.",
            "#.#",
            "..#",
            ".#.",
            "#..",
            "#..",
            "###",
        ],
        "3": [
            "##.",
            "..#",
            "..#",
            ".#.",
            "..#",
            "..#",
            "##.",
        ],
        "4": [
            "#.#",
            "#.#",
            "#.#",
            "###",
            "..#",
            "..#",
            "..#",
        ],
        "5": [
            "###",
            "#..",
            "##.",
            "..#",
            "..#",
            "#.#",
            ".#.",
        ],
        "6": [
            ".##",
            "#..",
            "#..",
            "##.",
            "#.#",
            "#.#",
            ".#.",
        ],
        "7": [
            "###",
            "..#",
            "..#",
            ".#.",
            ".#.",
            "#..",
            "#..",
        ],
        "8": [
            ".#.",
            "#.#",
            "#.#",
            ".#.",
            "#.#",
            "#.#",
            ".#.",
        ],
        "9": [
            ".#.",
            "#.#",
            "#.#",
            ".##",
            "..#",
            "..#",
            "##.",
        ],
        ":": [
            ".",
            ".",
            "#",
            ".",
            "#",
            ".",
            ".",
        ],
    },
)


# ---------------------------------------------------------------------------
# Font 3 — "Mini 5"
# 3 wide × 5 tall; tiny readout, leaves space above + below for status row.
# ---------------------------------------------------------------------------

MINI_5 = BitmapFont(
    name="Mini 5",
    height=5,
    spacing=1,
    glyphs={
        "0": ["###", "#.#", "#.#", "#.#", "###"],
        "1": [".#.", "##.", ".#.", ".#.", "###"],
        "2": ["##.", "..#", ".#.", "#..", "###"],
        "3": ["##.", "..#", ".#.", "..#", "##."],
        "4": ["#.#", "#.#", "###", "..#", "..#"],
        "5": ["###", "#..", "##.", "..#", "##."],
        "6": [".##", "#..", "###", "#.#", "###"],
        "7": ["###", "..#", ".#.", "#..", "#.."],
        "8": ["###", "#.#", "###", "#.#", "###"],
        "9": ["###", "#.#", "###", "..#", "##."],
        ":": [".", "#", ".", "#", "."],
    },
)


CLOCK_FONTS: dict[str, BitmapFont] = {
    BOLD_7.name: BOLD_7,
    SLIM_7.name: SLIM_7,
    MINI_5.name: MINI_5,
}


def names() -> list[str]:
    return list(CLOCK_FONTS.keys())


def get(name: str) -> BitmapFont:
    return CLOCK_FONTS.get(name, BOLD_7)
