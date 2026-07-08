import re

with open("TitanEmailShell/index.html", "r") as f:
    text = f.read()

# Remove HTML for account-refresh
text = re.sub(r'<div class="account-refresh".*?</div>', '', text, flags=re.DOTALL)

# Remove CSS for account-refresh
text = re.sub(r'/\* Refresh button — sidebar variant \*/.*?\.account-refresh\.spinning img \{\s*animation: spin 0\.7s linear infinite;\s*\}', '', text, flags=re.DOTALL)

# Remove HTML and CSS for other refresh buttons if any
text = re.sub(r'<div class="tabs-refresh-btn".*?</div>', '', text, flags=re.DOTALL)
text = re.sub(r'\.tabs-refresh-btn \{.*?\n\s*\}', '', text, flags=re.DOTALL)
text = re.sub(r'\.tabs-refresh-btn img \{.*?\n\s*\}', '', text, flags=re.DOTALL)
text = re.sub(r'\.tabs-refresh-btn:hover \{.*?\n\s*\}', '', text, flags=re.DOTALL)
text = re.sub(r'\.tabs-refresh-btn:hover img \{.*?\n\s*\}', '', text, flags=re.DOTALL)
text = re.sub(r'\.tabs-refresh-btn:active \{.*?\n\s*\}', '', text, flags=re.DOTALL)

with open("TitanEmailShell/index.html", "w") as f:
    f.write(text)

print("Stripped refresh button!")
