#!/usr/bin/env python3
"""
Corrige @media (800px) imediatamente aninhado dentro de outro (800px):
o interior vira 760px. Roda em loop até estabilizar.

Não trata `{` dentro de strings/urls (ex.: data-URI gigantes): nesses ficheiros
revisar à mão. Dois @media 800 em seletores irmãos (não aninhados) não são bug.
"""
import re
from pathlib import Path

MEDIA_800_OPEN = re.compile(
    r"@media\s+screen\s+and\s+\(\s*max-width:\s*800px\s*\)\s*\{"
)
REPLACEMENT = "@media screen and (max-width: 760px) {"


def find_matching_brace(s: str, open_idx: int) -> int:
    depth = 0
    i = open_idx
    while i < len(s):
        if s[i] == "{":
            depth += 1
        elif s[i] == "}":
            depth -= 1
            if depth == 0:
                return i
        i += 1
    return -1


def fix_one_pass(content: str) -> tuple[str, bool]:
    i = 0
    while i < len(content):
        m = MEDIA_800_OPEN.search(content, i)
        if not m:
            return content, False
        open_brace = content.find("{", m.start())
        close = find_matching_brace(content, open_brace)
        if close < 0:
            return content, False
        inner = content[open_brace + 1 : close]
        m2 = MEDIA_800_OPEN.search(inner)
        if m2:
            abs_inner = open_brace + 1 + m2.start()
            abs_inner_end = open_brace + 1 + m2.end()
            new_content = content[:abs_inner] + REPLACEMENT + content[abs_inner_end:]
            return new_content, True
        i = close + 1
    return content, False


def process_file(content: str) -> str:
    while True:
        content, changed = fix_one_pass(content)
        if not changed:
            break
    return content


def main():
    root = Path(__file__).resolve().parent.parent
    for path in sorted(root.glob("*.scss")):
        text = path.read_text(encoding="utf-8")
        new_text = process_file(text)
        if new_text != text:
            path.write_text(new_text, encoding="utf-8", newline="\n")
            print("fixed:", path.name)


if __name__ == "__main__":
    main()
