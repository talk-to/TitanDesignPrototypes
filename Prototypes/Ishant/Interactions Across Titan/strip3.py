import re

with open("TitanEmailShell/index.html", "r") as f:
    text = f.read()

# Remove shared-comp-tooltip CSS
text = re.sub(r'/\* ── Shared Composer Tooltip ── \*/.*?\.shared-comp-tooltip\.no-slide \{\s*transition: opacity 0\.15s ease;\s*\}', '', text, flags=re.DOTALL)

with open("TitanEmailShell/index.html", "w") as f:
    f.write(text)

print("Stripped shared-comp-tooltip CSS")
