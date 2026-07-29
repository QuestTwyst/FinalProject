with open('client/src/components/Profile.jsx') as f:
    content = f.read()

old = '        method: "PATCH",'
new = '        method: "PATCH",\n        cache: "no-store",'

count = content.count(old)
assert count == 1, f"expected 1 match, found {count}"
content = content.replace(old, new)

with open('client/src/components/Profile.jsx', 'w') as f:
    f.write(content)

print("Cache fix added.")
