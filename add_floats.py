import os
import glob

html_files = glob.glob('**/*.html', recursive=True)

fb_html = """
    <a
      aria-label="Facebook"
      class="facebook-float"
      href="https://www.facebook.com/share/1MSkPfrpmx/?mibextid=wwXIfr"
      rel="noopener"
      target="_blank"
    >
      <svg aria-hidden="true" viewbox="0 0 24 24" fill="currentColor">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
      </svg>
    </a>"""

ig_html = """
    <a
      aria-label="Instagram"
      class="instagram-float"
      href="https://www.instagram.com/hbasglobaltrade/"
      rel="noopener"
      target="_blank"
    >
      <svg aria-hidden="true" viewbox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    </a>"""

for filepath in html_files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    if '<a\n      aria-label="Facebook"' not in content and '<a aria-label="Facebook" class="facebook-float"' not in content:
        wa_start = content.find('class="whatsapp-float"')
        if wa_start != -1:
            wa_end = content.find('</a>', wa_start) + len('</a>')
            new_content = content[:wa_end] + fb_html + ig_html + content[wa_end:]
            with open(filepath, 'w') as f:
                f.write(new_content)
                print(f"Added floats to {filepath}")

css_path = 'styles.css'
with open(css_path, 'r') as f:
    css_content = f.read()

new_css = """
.facebook-float,
.instagram-float {
  position: fixed;
  right: 18px;
  z-index: 45;
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease;
}

.facebook-float {
  bottom: 86px;
  background: linear-gradient(135deg, #1877f2, #145dbf);
  box-shadow: 0 18px 34px rgba(24, 119, 242, 0.34);
  animation: pulse-ring-fb 2s infinite;
}

.instagram-float {
  bottom: 154px;
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  box-shadow: 0 18px 34px rgba(220, 39, 67, 0.34);
  animation: pulse-ring-ig 2s infinite;
}

.facebook-float:hover,
.instagram-float:hover {
  transform: scale(1.1) rotate(5deg);
}

.facebook-float:hover {
  box-shadow: 0 22px 38px rgba(24, 119, 242, 0.45);
}

.instagram-float:hover {
  box-shadow: 0 22px 38px rgba(220, 39, 67, 0.45);
}

@keyframes pulse-ring-fb {
  0% {
    box-shadow:
      0 18px 34px rgba(24, 119, 242, 0.34),
      0 0 0 0 rgba(24, 119, 242, 0.4);
  }
  70% {
    box-shadow:
      0 18px 34px rgba(24, 119, 242, 0.34),
      0 0 0 14px rgba(24, 119, 242, 0);
  }
  100% {
    box-shadow:
      0 18px 34px rgba(24, 119, 242, 0.34),
      0 0 0 0 rgba(24, 119, 242, 0);
  }
}

@keyframes pulse-ring-ig {
  0% {
    box-shadow:
      0 18px 34px rgba(220, 39, 67, 0.34),
      0 0 0 0 rgba(220, 39, 67, 0.4);
  }
  70% {
    box-shadow:
      0 18px 34px rgba(220, 39, 67, 0.34),
      0 0 0 14px rgba(220, 39, 67, 0);
  }
  100% {
    box-shadow:
      0 18px 34px rgba(220, 39, 67, 0.34),
      0 0 0 0 rgba(220, 39, 67, 0);
  }
}
"""

if '.facebook-float' not in css_content:
    pulse_wa_end = css_content.find('}\n\n.mobile-snapshot')
    if pulse_wa_end != -1:
        css_content = css_content[:pulse_wa_end+1] + "\n" + new_css + css_content[pulse_wa_end+1:]
        print("Added new CSS for floats")

css_content = css_content.replace('.whatsapp-float {\n    display: none;\n  }', '.whatsapp-float,\n  .facebook-float,\n  .instagram-float {\n    display: none;\n  }')
css_content = css_content.replace('.whatsapp-float:focus-visible,', '.whatsapp-float:focus-visible,\n.facebook-float:focus-visible,\n.instagram-float:focus-visible,')
css_content = css_content.replace('.whatsapp-float svg', '.whatsapp-float svg,\n.facebook-float svg,\n.instagram-float svg')

with open(css_path, 'w') as f:
    f.write(css_content)

