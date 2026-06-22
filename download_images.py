import os, re, urllib.request, urllib.parse, hashlib

base_dir = '/Users/amanaswal/Desktop/P6-HBAS Global Trade/HBAS_Website_AI'
assets_dir = os.path.join(base_dir, 'assets', 'external')
os.makedirs(assets_dir, exist_ok=True)

html_files = [os.path.join(base_dir, f) for f in os.listdir(base_dir) if f.endswith('.html')]
prod_dir = os.path.join(base_dir, 'products')
if os.path.exists(prod_dir):
    html_files += [os.path.join(prod_dir, f) for f in os.listdir(prod_dir) if f.endswith('.html')]

url_map = {}

def get_local_path(url, is_nested):
    if url in url_map:
        filename = url_map[url]
    else:
        # Generate a clean filename
        h = hashlib.md5(url.encode()).hexdigest()[:8]
        ext = '.jpg'
        if 'png' in url: ext = '.png'
        filename = f"img_{h}{ext}"
        local_filepath = os.path.join(assets_dir, filename)
        import ssl
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, context=ctx) as response, open(local_filepath, 'wb') as out_file:
                out_file.write(response.read())
            url_map[url] = filename
        except Exception as e:
            print(f"Failed to download {url}: {e}")
            return url # Fallback to original
            
    prefix = '../assets/external/' if is_nested else 'assets/external/'
    return prefix + filename

# Regex to find <img ... src="http..." ... />
img_pattern = re.compile(r'(<img[^>]*src=")(http[^"]+)("[^>]*>)')

for filepath in html_files:
    is_nested = 'products/' in filepath.replace('\\', '/')
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    def replacer(match):
        pre = match.group(1)
        url = match.group(2)
        post = match.group(3)
        local_src = get_local_path(url, is_nested)
        
        # Add dimensions if missing to reduce CLS
        tag = pre + local_src + post
        if 'width=' not in tag and 'height=' not in tag:
            tag = tag.replace('<img ', '<img width="700" height="466" ')
        return tag

    new_content = img_pattern.sub(replacer, content)
    
    # Let's also fix missing dimensions for local assets implicitly lacking them 
    # (Though we'll leave this to a second regex if needed)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {os.path.basename(filepath)}")

print("Done.")
