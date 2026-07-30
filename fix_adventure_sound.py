with open('client/src/components/StoryReader.jsx') as f:
    content = f.read()

old = 'Adventure: "/sounds/main.wav",'
new = 'Adventure: "/sounds/adventure.mp3",'

count = content.count(old)
assert count == 1, f"expected 1 match, found {count}"
content = content.replace(old, new)

with open('client/src/components/StoryReader.jsx', 'w') as f:
    f.write(content)

print("Adventure sound mapping fixed.")
