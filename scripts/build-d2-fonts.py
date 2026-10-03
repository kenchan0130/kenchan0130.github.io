"""D2図の文字幅計算と表示に使うNoto Sans JPのサブセットを生成する。

google/fontsの可変フォントから400と700のウェイトを切り出し、
英数字、記号、かな、JIS X 0208の漢字に絞ったTTFを出力する。

使い方:
  .venv/bin/pip install fonttools
  .venv/bin/python scripts/build-d2-fonts.py <NotoSansJP[wght].ttf> <出力ディレクトリ>
"""

import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

RANGES = [
    (0x0020, 0x007E),  # ASCII
    (0x00A0, 0x00FF),  # Latin-1 Supplement
    (0x2000, 0x206F),  # General Punctuation
    (0x2190, 0x21FF),  # Arrows
    (0x2200, 0x22FF),  # Mathematical Operators
    (0x2460, 0x24FF),  # Enclosed Alphanumerics
    (0x2500, 0x25FF),  # Box Drawing, Block Elements, Geometric Shapes
    (0x3000, 0x30FF),  # CJK Symbols and Punctuation, Hiragana, Katakana
    (0xFF00, 0xFFEF),  # Halfwidth and Fullwidth Forms
]


def jis_x_0208_characters() -> set[int]:
    characters = set()
    for first in range(0xA1, 0xFF):
        for second in range(0xA1, 0xFF):
            try:
                characters.add(ord(bytes([first, second]).decode("euc_jp")))
            except UnicodeDecodeError:
                pass
    return characters


def main() -> None:
    source, output = Path(sys.argv[1]), Path(sys.argv[2])
    output.mkdir(parents=True, exist_ok=True)
    unicodes = jis_x_0208_characters()
    for start, end in RANGES:
        unicodes.update(range(start, end + 1))

    for weight, name in [(400, "Regular"), (700, "Bold")]:
        font = instancer.instantiateVariableFont(
            TTFont(source), {"wght": weight}, updateFontNames=True
        )
        options = subset.Options()
        options.layout_features = ["*"]
        options.name_IDs = ["*"]
        options.notdef_outline = True
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=unicodes)
        subsetter.subset(font)
        font.save(output / f"NotoSansJP-{name}.ttf")


if __name__ == "__main__":
    main()
