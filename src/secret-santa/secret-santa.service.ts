import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { parseFile } from './utils/file-parser.util';
import { FileUploadResponseDto, SecretSantaRecord } from './dto/file-upload-response.dto';
import { AssignmentsService } from '../common/services/assignments.service';
@Injectable()
export class SecretSantaService {
  constructor(private readonly httpService: HttpService, private readonly assignmentsService: AssignmentsService) { }
  async processFiles(employeesFile: Express.Multer.File, previousYearFile: Express.Multer.File | null): Promise<FileUploadResponseDto> {

    const allowedTypes = [
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(employeesFile.mimetype) || (previousYearFile && !allowedTypes.includes(previousYearFile.mimetype))) {
      throw new UnsupportedMediaTypeException('Only CSV and XLSX files are supported');
    }
    const employees: SecretSantaRecord[] = await parseFile(employeesFile);
    const previousAssignments: SecretSantaRecord[] = previousYearFile
      ? await parseFile(previousYearFile)
      : [];
    // Get API URL from environment
    return this.assignmentsService.sendAssignments(employees, previousAssignments);
  }
}
