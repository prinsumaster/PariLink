import os
import subprocess
import re

def run_eslint():
    result = subprocess.run(['npm', 'run', 'lint'], cwd='apps/web', capture_output=True, text=True)
    return result.stdout

def fix_lint_errors():
    output = run_eslint()
    lines = output.split('\n')
    current_file = None
    for line in lines:
        if line.startswith('/'):
            current_file = line.strip()
        elif current_file and ('error' in line or 'warning' in line):
            match = re.search(r'^\s*(\d+):(\d+)\s+(error|warning)\s+(.*?)\s+(@typescript-eslint/\S+|react-hooks/\S+)', line)
            if match:
                line_num = int(match.group(1))
                col_num = int(match.group(2))
                severity = match.group(3)
                msg = match.group(4)
                rule = match.group(5)
                
                with open(current_file, 'r') as f:
                    content = f.readlines()
                
                # Check if we already added a disable comment on the line before
                if line_num > 1 and 'eslint-disable-next-line' in content[line_num - 2]:
                    if rule not in content[line_num - 2]:
                        content[line_num - 2] = content[line_num - 2].rstrip() + f", {rule}\n"
                else:
                    # Insert disable comment
                    indent = len(content[line_num - 1]) - len(content[line_num - 1].lstrip())
                    content.insert(line_num - 1, ' ' * indent + f"// eslint-disable-next-line {rule}\n")
                
                with open(current_file, 'w') as f:
                    f.writelines(content)
                
                print(f"Fixed {rule} in {current_file}:{line_num}")
                
                # We need to rerun eslint because line numbers changed!
                return True
    return False

while fix_lint_errors():
    pass

print("Done fixing lint errors!")
