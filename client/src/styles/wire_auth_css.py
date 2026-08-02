files = [
    'client/src/pages/Login.jsx',
    'client/src/components/CreateAccount.jsx',
    'client/src/components/PasswordReset.jsx',
]

old_import = 'import { API_BASE_URL } from "../config/api.js";'
new_import = 'import { API_BASE_URL } from "../config/api.js";\nimport "../styles/Auth.css";'

for path in files:
    with open(path) as f:
        content = f.read()
    count = content.count(old_import)
    assert count == 1, f"{path}: expected 1 match, found {count}"
    content = content.replace(old_import, new_import)
    with open(path, 'w') as f:
        f.write(content)
    print(f"{path}: Auth.css imported.")
