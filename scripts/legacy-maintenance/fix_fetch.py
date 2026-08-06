import os
import re

src_dir = './apps/web/src/app/(dashboard)'

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()

            if 'fetch(process.env.NEXT_PUBLIC_API_URL' in content:
                print(f"Processing {filepath}")
                
                # Replace the fetch block
                # The block looks like:
                #       const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/v1/finance/bank-statements', {
                #         headers: { 'Authorization': `Bearer ${token}` }
                #       });
                
                new_content = re.sub(
                    r"const res = await fetch\(process\.env\.NEXT_PUBLIC_API_URL \+ '([^']+)',\s*\{\s*headers:\s*\{\s*'Authorization': `Bearer \$\{token\}`\s*\}\s*\}\s*\);",
                    r"const res = await api.get('\1');",
                    content,
                    flags=re.MULTILINE | re.DOTALL
                )
                
                # Replace res.json() parsing
                new_content = re.sub(
                    r"if\s*\(\s*res\.ok\s*\)\s*\{\s*const\s+json\s*=\s*await\s+res\.json\(\);\s*setData\(json\.data\s*\|\|\s*\[\]\);\s*\}",
                    r"setData(res.data?.data || res.data || []);",
                    new_content,
                    flags=re.MULTILINE | re.DOTALL
                )
                
                # Also replace cases where it was json instead of json.data
                # e.g. setData(json || [])
                new_content = re.sub(
                    r"if\s*\(\s*res\.ok\s*\)\s*\{\s*const\s+json\s*=\s*await\s+res\.json\(\);\s*setData\(json\s*\|\|\s*\[\]\);\s*\}",
                    r"setData(res.data || []);",
                    new_content,
                    flags=re.MULTILINE | re.DOTALL
                )

                if "import { api }" not in new_content:
                    new_content = "import { api } from '@/services/api';\n" + new_content
                    
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Fixed {filepath}")
