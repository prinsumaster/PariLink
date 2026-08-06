import os

web_dir = 'apps/web/src'
for root, dirs, files in os.walk(web_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            file_path = os.path.join(root, file)
            with open(file_path, 'r') as f:
                lines = f.readlines()
            
            # Remove any line that was added by my script
            new_lines = [line for line in lines if '// eslint-disable-next-line' not in line]
            
            if len(lines) != len(new_lines):
                with open(file_path, 'w') as f:
                    f.writelines(new_lines)
                print(f"Cleaned {file_path}")
