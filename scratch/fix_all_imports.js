const fs = require('fs');

const files = [
  'apps/api/src/trips/trip-desks.controller.ts',
  'apps/api/src/trips/trips.controller.ts',
  'apps/api/src/drivers/drivers.controller.ts',
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('NotFoundException')) {
    content = content.replace(/\} from '@nestjs\/common';/, '  NotFoundException,\n} from \'@nestjs/common\';');
    fs.writeFileSync(file, content);
  } else if (!content.match(/NotFoundException.*\} from '@nestjs\/common'/s)) {
    // Already includes it, maybe?
  }
}
