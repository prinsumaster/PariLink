import os
import re

def revert_unknown(root_dir):
    for dirpath, _, filenames in os.walk(root_dir):
        if 'node_modules' in dirpath or '.next' in dirpath or 'dist' in dirpath:
            continue
        for filename in filenames:
            if filename.endswith('.ts') or filename.endswith('.tsx'):
                filepath = os.path.join(dirpath, filename)
                with open(filepath, 'r') as f:
                    content = f.read()
                
                new_content = re.sub(r':\s*unknown\b', ': any', content)
                new_content = re.sub(r'\bas\s+unknown\b', 'as any', new_content)
                
                if new_content != content:
                    with open(filepath, 'w') as f:
                        f.write(new_content)
                    print(f"Reverted {filepath}")

revert_unknown('apps/api/src')
revert_unknown('apps/web/src')
