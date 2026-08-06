import os
import re

def fix_unknown(root_dir):
    for dirpath, _, filenames in os.walk(root_dir):
        if 'node_modules' in dirpath or '.next' in dirpath or 'dist' in dirpath:
            continue
        for filename in filenames:
            if filename.endswith('.ts') or filename.endswith('.tsx'):
                filepath = os.path.join(dirpath, filename)
                with open(filepath, 'r') as f:
                    content = f.read()
                
                new_content = re.sub(r'req:\s*unknown', 'req: any', content)
                new_content = re.sub(r'where:\s*unknown', 'where: any', new_content)
                new_content = re.sub(r'data:\s*unknown', 'data: any', new_content)
                new_content = re.sub(r'payload:\s*unknown', 'payload: any', new_content)
                new_content = re.sub(r'error:\s*unknown', 'error: any', new_content)
                
                if new_content != content:
                    with open(filepath, 'w') as f:
                        f.write(new_content)
                    print(f"Reverted {filepath}")

fix_unknown('apps/api/src')
fix_unknown('apps/web/src')
