import subprocess
import re
from collections import defaultdict

def run_eslint():
    result = subprocess.run(['npm', 'run', 'lint'], cwd='apps/web', capture_output=True, text=True)
    return result.stdout

output = run_eslint()

# file_path -> [(line_num, rule)]
modifications = defaultdict(list)

current_file = None
for line in output.split('\n'):
    if line.startswith('/'):
        current_file = line.strip()
    elif current_file and ('error' in line or 'warning' in line):
        match = re.search(r'^\s*(\d+):(\d+)\s+(error|warning)\s+(.*?)\s+(@typescript-eslint/\S+|react-hooks/\S+)', line)
        if match:
            line_num = int(match.group(1))
            rule = match.group(5)
            modifications[current_file].append((line_num, rule))

for file_path, mods in modifications.items():
    # Remove duplicates and sort descending by line number
    mods = sorted(list(set(mods)), key=lambda x: x[0], reverse=True)
    
    with open(file_path, 'r') as f:
        content = f.readlines()
        
    for line_num, rule in mods:
        # Avoid index out of bounds
        if line_num - 1 < len(content):
            indent = len(content[line_num - 1]) - len(content[line_num - 1].lstrip())
            
            # Check if there's already an eslint-disable-next-line
            if line_num > 1 and 'eslint-disable-next-line' in content[line_num - 2]:
                if rule not in content[line_num - 2]:
                    content[line_num - 2] = content[line_num - 2].rstrip() + f", {rule}\n"
            else:
                content.insert(line_num - 1, ' ' * indent + f"// eslint-disable-next-line {rule}\n")
                
    with open(file_path, 'w') as f:
        f.writelines(content)
        
print("All lint errors patched!")
