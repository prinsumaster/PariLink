const fs = require('fs');

const file = 'apps/api/src/admin/enterprise-admin.service.spec.ts';
let content = fs.readFileSync(file, 'utf8');

// Remove the ones I added at the top of each block
content = content.replace(/      count: jest\.fn\(\)\.mockResolvedValue\(5\),\n/g, '');
content = content.replace(/      count: jest\.fn\(\)\.mockResolvedValue\(10\),\n/g, '');
content = content.replace(/      count: jest\.fn\(\)\.mockResolvedValue\(15\),\n/g, '');
content = content.replace(/      count: jest\.fn\(\)\.mockResolvedValue\(20\),\n/g, '');
content = content.replace(/      count: jest\.fn\(\)\.mockResolvedValue\(25\),\n/g, '');

// Since the file originally didn't have count for user, vehicle, driver, trip, load at the top, removing them restores the original state.
// Wait, the error was "An object literal cannot have multiple properties with the same name."
// This means the file originally ALREADY HAD `count` for `user`, `vehicle`, etc. at the bottom of their blocks!
// Let's verify by just removing my additions and running typecheck.

fs.writeFileSync(file, content);
console.log('Duplicates removed.');
