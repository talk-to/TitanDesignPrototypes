import re

with open("TitanEmailShell/index.html", "r") as f:
    text = f.read()

# For .tab-switch
text = re.sub(r'\.tab-switch::before \{.*?\}\n', '', text, flags=re.DOTALL)
text = re.sub(r'\.tab-switch:not\(\.active\):hover::before \{.*?\}\n', '', text, flags=re.DOTALL)
text = re.sub(r'\.tab-switch:not\(\.active\):active \{.*?\}\n', '', text, flags=re.DOTALL)
text = re.sub(r'\.tab-switch \{\s*background: transparent;\s*', '.tab-switch {\n      background: #2d314b;\n      ', text)

# General pattern for the ::before hover overlays:
# .className::before { content: ''; ... opacity: 0; transform: scale(...); }
# .className:not(.active):hover::before { opacity: 1; transform: scale(...); }
# .className:not(.active):active { ... }

# Replace .action-opt::before block
text = re.sub(r'\.action-opt::before \{.*?\}\n', '', text, flags=re.DOTALL)
text = re.sub(r'\.action-opt:not\(\.active\):hover::before \{.*?\}\n', '', text, flags=re.DOTALL)
text = re.sub(r'\.action-opt:not\(\.active\):active \{.*?\}\n', '', text, flags=re.DOTALL)
text = re.sub(r'\.action-opt \{\s*background: transparent;\s*', '.action-opt {\n      background: transparent;\n      ', text)
text = re.sub(r'\.action-opt:hover \{\s*\}\n', '.action-opt:hover {\n      background: #eaeaea;\n    }\n', text)

# Replace .toolbar-icon::before
text = re.sub(r'\.toolbar-icon::before \{.*?\}\n', '', text, flags=re.DOTALL)
text = re.sub(r'\.toolbar-icon:not\(\.active\):hover::before \{.*?\}\n', '', text, flags=re.DOTALL)
text = re.sub(r'\.toolbar-icon:not\(\.active\):active \{.*?\}\n', '', text, flags=re.DOTALL)

# Replace .nav-item::before
text = re.sub(r'\.nav-item::before \{.*?\}\n', '', text, flags=re.DOTALL)
text = re.sub(r'\.nav-item:not\(\.active\):hover::before \{.*?\}\n', '', text, flags=re.DOTALL)
text = re.sub(r'\.nav-item:not\(\.active\):active \{.*?\}\n', '', text, flags=re.DOTALL)

# Replace .footer-btn::before
text = re.sub(r'\.footer-btn::before \{.*?\}\n', '', text, flags=re.DOTALL)
text = re.sub(r'\.footer-btn:not\(\.active\):hover::before \{.*?\}\n', '', text, flags=re.DOTALL)
text = re.sub(r'\.footer-btn:not\(\.active\):active \{.*?\}\n', '', text, flags=re.DOTALL)

# Replace .reply-action::before
text = re.sub(r'\.reply-action::before \{.*?\}\n', '', text, flags=re.DOTALL)
text = re.sub(r'\.reply-action:not\(\.active\):hover::before \{.*?\}\n', '', text, flags=re.DOTALL)
text = re.sub(r'\.reply-action:not\(\.active\):active \{.*?\}\n', '', text, flags=re.DOTALL)
text = re.sub(r'\.reply-action:hover \{\s*\}\n', '.reply-action:hover {\n      background: #f5f5f5;\n    }\n', text)

# Find any remaining `transform: scale` inside :hover::before
text = re.sub(r'\.[a-zA-Z0-9_-]+:hover::before\s*\{[^\}]*transform:\s*scale\([^\)]+\)[^\}]*\}', '', text, flags=re.DOTALL)
text = re.sub(r'\.[a-zA-Z0-9_-]+::before\s*\{[^\}]*transform:\s*scale\([^\)]+\)[^\}]*\}', '', text, flags=re.DOTALL)

with open("TitanEmailShell/index.html", "w") as f:
    f.write(text)

print("Removed subtle scaling hovers")
