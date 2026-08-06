import os
import re

def fix_any(root_dir):
    for dirpath, _, filenames in os.walk(root_dir):
        if 'node_modules' in dirpath or '.next' in dirpath or 'dist' in dirpath:
            continue
        for filename in filenames:
            if filename.endswith('.ts') or filename.endswith('.tsx'):
                filepath = os.path.join(dirpath, filename)
                with open(filepath, 'r') as f:
                    content = f.read()
                
                # Simple replacement for ': any' and 'as any'
                new_content = re.sub(r':\s*any\b', ': unknown', content)
                new_content = re.sub(r'\bas\s+any\b', 'as unknown', new_content)
                
                if new_content != content:
                    with open(filepath, 'w') as f:
                        f.write(new_content)
                    print(f"Fixed {filepath}")

fix_any('apps/api/src')
fix_any('apps/web/src')
