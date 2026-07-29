with open('client/src/components/StoryReader.jsx') as f:
    content = f.read()

old = 'const [processingLabel, setProcessingLabel] = useState("");'
new = 'const [processingLabel, setProcessingLabel] = useState("");\n\n  useEffect(() => {\n    document.body.classList.toggle("qtProcessingCursor", isProcessing);\n    return () => {\n      document.body.classList.remove("qtProcessingCursor");\n    };\n  }, [isProcessing]);'

assert content.count(old) == 1, "state anchor not found"
content = content.replace(old, new)

with open('client/src/components/StoryReader.jsx', 'w') as f:
    f.write(content)

print("useEffect added.")

with open('client/src/index.css') as f:
    css = f.read()

addition = chr(10) + "body.qtProcessingCursor," + chr(10) + "body.qtProcessingCursor * {" + chr(10) + "  cursor: wait !important;" + chr(10) + "}" + chr(10)

if "qtProcessingCursor" not in css:
    css += addition
    with open("client/src/index.css", "w") as f:
        f.write(css)
    print("Added cursor CSS to index.css")
else:
    print("Cursor CSS already present, skipped")
