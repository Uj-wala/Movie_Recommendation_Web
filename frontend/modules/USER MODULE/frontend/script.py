import re
import os

with open(r'd:\frontend\src\pages\Register.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

options_match = re.search(r'<select[^>]*>([\s\S]*?)</select>', content)
if options_match:
    options_html = options_match.group(1)
    
    # parse options
    options = re.findall(r'<option value=\"(.*?)\">(.*?)</option>', options_html)
    
    # make data file
    if not os.path.exists(r'd:\frontend\src\utils'):
        os.makedirs(r'd:\frontend\src\utils')
        
    with open(r'd:\frontend\src\utils\countryCodes.ts', 'w', encoding='utf-8') as f:
        f.write('export const countryCodes = [\n')
        for val, label in options:
            f.write(f'  {{ value: "{val}", label: "{label}" }},\n')
        f.write('];\n')
    print('Created countryCodes.ts')
