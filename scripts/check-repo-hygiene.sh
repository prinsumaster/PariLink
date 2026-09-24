#!/bin/bash

# check-repo-hygiene.sh
# Detects stray scripts and unauthorized files at the repository root and in app directories.

echo "Checking repository hygiene..."
EXIT_CODE=0

# Check for .js, .ts, .sql, .txt files at the root level (ignoring standard config files)
STRAY_ROOT_FILES=$(find . -maxdepth 1 -type f \( -name "*.js" -o -name "*.ts" -o -name "*.sql" -o -name "*.txt" \) ! -name "commitlint.config.js" ! -name "prettier.config.js" ! -name "ecosystem.config.js")

if [ -n "$STRAY_ROOT_FILES" ]; then
    echo "❌ Error: Found unauthorized throwaway files at the root level:"
    echo "$STRAY_ROOT_FILES"
    echo "Please move reusable scripts to scripts/ or delete throwaway scripts (use scratch/ for temporary work)."
    EXIT_CODE=1
fi

# Check for loose scripts in apps/web (excluding config files and tests)
STRAY_WEB_FILES=$(find apps/web -maxdepth 1 -type f \( -name "*.js" -o -name "*.ts" \) ! -name "next.config.js" ! -name "playwright.config.ts" ! -name "postcss.config.js" ! -name "tailwind.config.ts" ! -name "jest.config.ts" ! -name "next-env.d.ts" ! -name "next.config.ts")

if [ -n "$STRAY_WEB_FILES" ]; then
    echo "❌ Error: Found unauthorized throwaway files in apps/web:"
    echo "$STRAY_WEB_FILES"
    EXIT_CODE=1
fi

# Check for loose scripts in apps/api root (excluding config and compiled output)
STRAY_API_FILES=$(find apps/api -maxdepth 1 -type f \( -name "*.js" -o -name "*.ts" -o -name "*.pdf" \) ! -name "jest.config.ts" ! -name "tsconfig.json" ! -name "tsconfig.build.json")

if [ -n "$STRAY_API_FILES" ]; then
    echo "❌ Error: Found unauthorized throwaway files in apps/api:"
    echo "$STRAY_API_FILES"
    echo "Delete or move to scratch/ before committing."
    EXIT_CODE=1
fi

# Check for committed PDF/binary test artifacts anywhere outside docs
STRAY_PDFS=$(git ls-files | grep -E "\.pdf$" | grep -v "apps/docs/")

if [ -n "$STRAY_PDFS" ]; then
    echo "❌ Error: PDF test artifacts committed to the repo (not in docs/):"
    echo "$STRAY_PDFS"
    EXIT_CODE=1
fi

if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Repository hygiene check passed. No stray scripts found."
fi

exit $EXIT_CODE
