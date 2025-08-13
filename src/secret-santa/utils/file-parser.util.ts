import * as csv from 'csv-parser';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

export function parseFile(file: Express.Multer.File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const ext = file.originalname.split('.').pop()?.toLowerCase();

    if (ext === 'csv') {
      const results: any[] = [];
      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', reject);
    } else if (ext === 'xlsx') {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      resolve(sheet);
    } else {
      reject(new Error('Unsupported file format'));
    }
  });
}
