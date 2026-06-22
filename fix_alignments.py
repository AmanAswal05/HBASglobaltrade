import os
import glob
import re

html_files = glob.glob('**/*.html', recursive=True)

for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()

    original_content = content

    # Remove centering classes from section-head
    content = content.replace(' center-title-container', '')
    content = content.replace('center-title-container ', '')
    content = content.replace(' text-center', '')
    content = content.replace('text-center ', '')
    content = content.replace(' eyebrow-center', '')
    content = content.replace('eyebrow-center ', '')
    content = content.replace(' certificates-head', '')
    content = content.replace('certificates-head ', '')

    # Also remove center-title-container if it's the only class (e.g., class="center-title-container")
    content = content.replace('class="center-title-container"', '')

    # Remove mb-16 from eyebrow
    content = content.replace('class="eyebrow mb-16"', 'class="eyebrow"')

    if content != original_content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

