with open('client/src/components/EditStoryModal.module.css') as f:
    content = f.read()

addition = """
.genreCheckboxGroup {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.genreCheckboxLabel {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border: 1.5px solid rgba(22, 50, 79, 0.2);
  border-radius: 999px;
  font-size: 0.9rem;
  color: #16324f;
  cursor: pointer;
}

.genreCheckboxLabel input {
  cursor: pointer;
}
"""

if "genreCheckboxGroup" not in content:
    content += addition
    with open('client/src/components/EditStoryModal.module.css', 'w') as f:
        f.write(content)
    print("Checkbox CSS added.")
else:
    print("Checkbox CSS already present, skipped.")
