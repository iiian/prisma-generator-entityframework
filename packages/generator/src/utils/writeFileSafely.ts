import fs from 'fs';
import path from 'path';
import { formatFile } from './formatFile';

export const writeFileSafely = (writeLocation: string, content: any) => {
  fs.mkdirSync(path.dirname(writeLocation), {
    recursive: true,
  });

  fs.writeFileSync(writeLocation, content);
};
