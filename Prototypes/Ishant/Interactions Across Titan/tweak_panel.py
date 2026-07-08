import re

with open("index.html", "r") as f:
    text = f.read()

# 1. Box padding and gap
text = re.sub(r'padding: 10px 14px 12px;', 'padding: 16px 20px 18px;', text)
# iter-panel gap
text = re.sub(r'(\.iter-panel \{[^}]*)gap: 10px;', r'\1gap: 16px;', text)

# 2. Row vertical spacing
text = re.sub(r'(\.iter-panel-content \{[^}]*)gap: 10px;', r'\1gap: 16px;', text)

# 3. Button size
text = re.sub(r'padding: 4px 11px;', 'padding: 6px 14px;', text)
text = re.sub(r'(\.iter-tab \{[^}]*)font-size: 11px;', r'\1font-size: 12px;', text)

with open("index.html", "w") as f:
    f.write(text)

print("Tweaked panel!")
