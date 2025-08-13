import { Module } from '@nestjs/common';
import { SecretSantaController } from './secret-santa.controller';
import { SecretSantaService } from './secret-santa.service';
import { HttpModule } from '@nestjs/axios';
import { AssignmentsService } from '../common/services/assignments.service';
@Module({
  imports: [HttpModule],
  controllers: [SecretSantaController],
  providers: [SecretSantaService, AssignmentsService],
})
export class SecretSantaModule {}