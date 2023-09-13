import argparse
import pathlib
import re


widget_regex = re.compile(r"""<<widget '?"?([\w\-_]+)"?'?""")
macro_regex = re.compile(r"""Macro\.add\(["']([\w\-_]+)["']""")
define_macro_regex = re.compile(r'DefineMacroS?\("([\w\-_]+)"')
javascript_regex = re.compile(r"function ([\w\-_]+)\(")
used_regex = re.compile(r"<</?([\w\-_]+).*?>>")
comment_regex = re.compile(r"<!--[\s\S]*?-->")
javascript_comment1_regex = re.compile(r"\s*//.*")
javascript_comment2_regex = re.compile(r"\s*/\*[\s\S]*?\*/")

default = {
    "if",
    "elseif",
    "else",
    "set",
    "link",
    "linkappend",
    "linkprepend",
    "linkreplace",
    "case",
    "widget",
    "break",
    "include",
    "compute",
    "nobr",
    "return",
    "for",
    "silently",
    "audio",
    "cacheaudio",
    "createaudiogroup",
    "createplaylist",
    "masteraudio",
    "playlist",
    "done",
    "print",
    "append",
    "unset",
    "switch",
    "prepend",
    "radiobutton",
    "repeat",
    "default",
    "stop",
    "run",
    "replace",
    "numberbox",
    "cycle",
    "copy",
    "timed",
    "checkbox",
    "addclass",
    "removeclass",
    "continue",
    "listbox",
    "optionsfrom",
    "option",
    "capture",
    "button",
    "choice",
    "remove",
    "onchange",
    "condition",
    "dynamicblock",
    "textbox",
    "actions",
    "back",
    "safereplace",
    "script",
    "toggleclass",
    "twinescript",
    "-",
    "goto",
    "type",
    "textarea",
}


def get_js_macros(path: pathlib.Path):
    content = path.read_text(encoding="utf-8")
    content = re.sub(javascript_comment1_regex, "", content)
    content = re.sub(javascript_comment2_regex, "", content)
    macros = set()
    for i in re.findall(macro_regex, content):
        macros.add(i)
    for i in re.findall(define_macro_regex, content):
        macros.add(i)
    for i in re.findall(javascript_regex, content):
        macros.add(i)
    return macros


def get_twee_macros(path: pathlib.Path):
    content = path.read_text(encoding="utf-8")
    content = re.sub(comment_regex, "", content)
    content = re.sub(javascript_comment2_regex, "", content)
    macros = set()
    for i in re.findall(widget_regex, content):
        macros.add(i)
    return macros


def check(path, macros):
    content = path.read_text(encoding="utf-8")
    if path.suffix == ".js":
        content = re.sub(javascript_comment1_regex, "", content)
        m = re.search(javascript_comment2_regex, content)
        while m:
            t = content[m.start() : m.end()]
            content = content.replace(t, "\n" * t.count("\n"))
            m = re.search(javascript_comment2_regex, content)
    elif path.suffix == ".twee":
        m = re.search(comment_regex, content)
        while m:
            t = content[m.start() : m.end()]
            content = content.replace(t, "\n" * t.count("\n"))
            m = re.search(comment_regex, content)
        m = re.search(javascript_comment2_regex, content)
        while m:
            t = content[m.start() : m.end()]
            content = content.replace(t, "\n" * t.count("\n"))
            m = re.search(javascript_comment2_regex, content)
    for i in re.finditer(used_regex, content):
        if i.group(1).startswith("-"):
            continue
        if i.group(1).lower() not in macros:
            n = content[: i.start()].count("\n") + 1
            print(f"{str(path)}:{n}: {i.group(1)}")


parser = argparse.ArgumentParser(description="Checks macros.")
parser.add_argument("paths", nargs="*", type=pathlib.Path)


args = parser.parse_args()
if not args.paths:
    print("No paths")
    exit(1)
paths: list[pathlib.Path] = args.paths

targets = []
macros = default
for i in paths:
    if i.suffix == ".js":
        macros |= get_js_macros(i)
        targets.append(i)
    elif i.suffix == ".twee":
        macros |= get_twee_macros(i)
        targets.append(i)
macros = set(map(str.lower, macros))

for i in targets:
    check(i, macros)
