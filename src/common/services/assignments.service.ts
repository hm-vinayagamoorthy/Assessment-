import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SecretSantaRecord, FileUploadResponseDto } from '../../secret-santa/dto/file-upload-response.dto';

@Injectable()
export class AssignmentsService {
  constructor(private readonly httpService: HttpService) {}

  private readonly apiUrl = process.env.ASSIGNMENTS_API_URL || 'http://localhost:3001/assignments';

  async sendAssignments(
    employees: SecretSantaRecord[],
    previousAssignments: SecretSantaRecord[]
  ): Promise<FileUploadResponseDto> {
    try {
      const res = await firstValueFrom(
        this.httpService.post(this.apiUrl, { employees, previousAssignments })
      );

      const data = res?.data?.data;

      return {
        message: data?.message,
        downloadUrl: data?.filePath,
        csvContent: data?.csvContent,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(error.message || 'Failed to send assignments');
    }
  }
}
