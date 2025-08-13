import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SecretSantaService } from './secret-santa.service';

@Controller('secret-santa')
export class SecretSantaController {
  constructor(private readonly secretSantaService: SecretSantaService) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'employeesFile', maxCount: 1 },
      { name: 'previousYearFile', maxCount: 1 },
    ], { limits: { fileSize: 5 * 1024 * 1024 } } ),
  )
  async uploadFiles(
    @UploadedFiles()
    files: {
      employeesFile?: Express.Multer.File[];
      previousYearFile?: Express.Multer.File[];
    },
  ) {
    
    if (!files || !files.employeesFile) {
    throw new BadRequestException('employeesFile File are required');
  }

  const employeesFile = files.employeesFile[0];
  const previousYearFile = files.previousYearFile?.[0] ?? null;
    return await this.secretSantaService.processFiles(
      employeesFile,
      previousYearFile,
    );
  }
}
