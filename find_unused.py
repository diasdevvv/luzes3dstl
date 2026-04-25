import re

def find_unused_css():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    with open('style.css', 'r', encoding='utf-8') as f:
        css = f.read()

    # Find all classes in CSS
    css_classes = set(re.findall(r'\.([a-zA-Z0-9_-]+)', css))
    
    # Exclude pseudoclasses, animation keyframes, and common swiper/lucide injected classes
    ignore = ['active', 'hidden', 'swiper', 'lucide', 'visible', 'show', 'hover', 'focus', 'before', 'after', 'root']
    
    unused = []
    for cls in css_classes:
        if cls in ignore or cls.startswith('swiper'):
            continue
        if cls not in html:
            unused.append(cls)
            
    print("Potentially unused CSS classes:")
    for cls in sorted(unused):
        print(cls)

if __name__ == "__main__":
    find_unused_css()
