with open('client/src/components/StoryReader.jsx') as f:
    content = f.read()

# 1. Remove the overlay JSX entirely
old_overlay = ('{isProcessing && (\n'
               '        <div className={styles.processingOverlay} role="status" aria-live="polite">\n'
               '          <LoadingSpinner label={processingLabel} />\n'
               '      </div>\n'
               '      )}\n\n'
               '      {soundSrc')
new_overlay = '{soundSrc'
assert content.count(old_overlay) == 1, "overlay pattern not found"
content = content.replace(old_overlay, new_overlay)

# 2. Add a useEffect that toggles a real cursor-changing class on <body>
# while isProcessing is true. This uses a plain (non-CSS-Module) global
# class name on purpose, since document.body.classList needs the
# literal string, not a hashed module class.
old_state = 'const [processingLabel, setProcessingLabel] = useState("");'
new_state = ('const [processingLabel, setProcessingLabel] = useState("");\n\n'
             '  useEffect(() => {\n'
             '    document.body.classList.toggle("qtProcessingCursor", isProcessing);\n'
             '    return () => {\n'
             '      document.body.classList.remove("qtProcessingCursor");\n'
             '    };\n'
             '  }, [isProcessing]);')
assert content.count(old_state) == 1, "state anchor not found"
content = content.replace(old_state, new_state)

with open('client/src/components/StoryReader.jsx', 'w') as f:
    f.write(content)

print("Fixed StoryReader.jsx")

# 3. Add the global cursor CSS to index.css (plain CSS, not a module,
# since it needs to match the literal body class name above)
with open('client/src/index.css') as f:
    css = f.read()

addition = '''
body.qtProcessingCursor,
body.qtProcessingCursor * {
  cursor: wait !important;
}
'''

if 'qtProcessingCursor' not in css:
    css += addition
    with open('client/src/index.css', 'w') as f:
        f.write(css)
    print("Added cursor CSS to index.css")
else:
    print("Cursor CSS already present in index.css, skipped")
