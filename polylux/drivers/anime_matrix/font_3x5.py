"""Tiny 3x5 pixel font.

Designed to fit on the short axis (7 cols) of the AniMe Matrix when text
is rotated 90/270 to run along the long axis (36 rows). Covers digits
0-9, ':', '.', ' ', '-'. Add more glyphs as needed.

Each glyph is a list of 5 rows of 3 characters: '#' = pixel on, '.' = off.
"""
from __future__ import annotations

GLYPH_W = 3
GLYPH_H = 5

GLYPHS: dict[str, list[str]] = {
    "0": [
        "###",
        "#.#",
        "#.#",
        "#.#",
        "###",
    ],
    "1": [
        ".#.",
        "##.",
        ".#.",
        ".#.",
        "###",
    ],
    "2": [
        "###",
        "..#",
        ".#.",
        "#..",
        "###",
    ],
    "3": [
        "###",
        "..#",
        ".##",
        "..#",
        "###",
    ],
    "4": [
        "#.#",
        "#.#",
        "###",
        "..#",
        "..#",
    ],
    "5": [
        "###",
        "#..",
        "###",
        "..#",
        "###",
    ],
    "6": [
        "###",
        "#..",
        "###",
        "#.#",
        "###",
    ],
    "7": [
        "###",
        "..#",
        ".#.",
        ".#.",
        ".#.",
    ],
    "8": [
        "###",
        "#.#",
        "###",
        "#.#",
        "###",
    ],
    "9": [
        "###",
        "#.#",
        "###",
        "..#",
        "###",
    ],
    ":": [
        "...",
        ".#.",
        "...",
        ".#.",
        "...",
    ],
    ".": [
        "...",
        "...",
        "...",
        "...",
        ".#.",
    ],
    " ": [
        "...",
        "...",
        "...",
        "...",
        "...",
    ],
    "-": [
        "...",
        "...",
        "###",
        "...",
        "...",
    ],
    "C": [
        "###",
        "#..",
        "#..",
        "#..",
        "###",
    ],
    "F": [
        "###",
        "#..",
        "###",
        "#..",
        "#..",
    ],
    "%": [
        "#.#",
        "..#",
        ".#.",
        "#..",
        "#.#",
    ],
}


def text_width(text: str, spacing: int = 1) -> int:
    """Pixel width of `text` rendered with `spacing` pixels between glyphs."""
    if not text:
        return 0
    return len(text) * GLYPH_W + (len(text) - 1) * spacing


def render_text_bitmap(text: str, spacing: int = 1) -> list[list[bool]]:
    """Render `text` to a 2D bitmap (rows × cols, True = pixel on)."""
    w = text_width(text, spacing)
    bitmap = [[False] * w for _ in range(GLYPH_H)]
    if not text:
        return bitmap
    x_offset = 0
    for ch in text:
        glyph = GLYPHS.get(ch)
        if glyph is None:
            # Unknown glyph — render a 3×5 blank.
            glyph = GLYPHS[" "]
        for y in range(GLYPH_H):
            row = glyph[y]
            for x in range(GLYPH_W):
                if row[x] == "#":
                    bitmap[y][x_offset + x] = True
        x_offset += GLYPH_W + spacing
    return bitmap
