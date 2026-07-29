with open("client/src/index.css") as f:
    css = f.read()

old = """body.qtProcessingCursor,
body.qtProcessingCursor * {
  cursor: wait !important;
}"""

new = """body.qtProcessingCursor,
body.qtProcessingCursor * {
  cursor: none !important;
}"""

assert old in css, "pattern not found in index.css"
css = css.replace(old, new)

with open("client/src/index.css", "w") as f:
    f.write(css)

print("index.css updated to cursor: none")
