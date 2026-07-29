with open('client/src/components/StoryReader.module.css') as f:
    css = f.read()

old1 = """.themeHorror .storyCard {
  background: rgba(15, 17, 20, 0.92);
  border: 1px solid rgba(120, 30, 30, 0.4);
  box-shadow:
    0 0 30px rgba(100, 10, 10, 0.15),
    0 10px 40px rgba(0, 0, 0, 0.7);
}"""

new1 = """.themeHorror .storyCard {
  background: rgba(15, 17, 20, 0.55);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(120, 30, 30, 0.4);
  box-shadow:
    0 0 30px rgba(100, 10, 10, 0.15),
    0 10px 40px rgba(0, 0, 0, 0.7);
}"""

old2 = """.themeHorror.themeDark .storyCard {
  background: rgba(8, 9, 11, 0.95);
  border-color: rgba(150, 30, 30, 0.35);
}"""

new2 = """.themeHorror.themeDark .storyCard {
  background: rgba(8, 9, 11, 0.6);
  backdrop-filter: blur(6px);
  border-color: rgba(150, 30, 30, 0.35);
}"""

assert css.count(old1) == 1, "pattern 1 not found or not unique"
assert css.count(old2) == 1, "pattern 2 not found or not unique"

css = css.replace(old1, new1)
css = css.replace(old2, new2)

with open('client/src/components/StoryReader.module.css', 'w') as f:
    f.write(css)

print("Fixed.")
