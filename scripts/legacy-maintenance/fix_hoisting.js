const fs = require('fs');

const fixes = [
  {
    file: './apps/web/src/app/(dashboard)/automation/history/page.tsx',
    replacements: [
      { from: 'const fetchHistory = async () => {', to: 'async function fetchHistory() {' }
    ]
  },
  {
    file: './apps/web/src/app/(dashboard)/automation/page.tsx',
    replacements: [
      { from: 'const fetchWorkflows = async () => {', to: 'async function fetchWorkflows() {' }
    ]
  },
  {
    file: './apps/web/src/app/(dashboard)/chat/page.tsx',
    replacements: [
      { from: 'const fetchChannels = async () => {', to: 'async function fetchChannels() {' },
      { from: 'const loadMessages = async (channelId: string, silent = false) => {', to: 'async function loadMessages(channelId: string, silent = false) {' }
    ]
  },
  {
    file: './apps/web/src/app/(dashboard)/inbox/page.tsx',
    replacements: [
      { from: 'const selectThread = async (thread: any) => {', to: 'async function selectThread(thread: any) {' },
      { from: 'const fetchThreads = async () => {', to: 'async function fetchThreads() {' }
    ]
  }
];

for (const fix of fixes) {
  let content = fs.readFileSync(fix.file, 'utf8');
  for (const r of fix.replacements) {
    content = content.replace(r.from, r.to);
  }
  fs.writeFileSync(fix.file, content);
  console.log('Fixed', fix.file);
}
