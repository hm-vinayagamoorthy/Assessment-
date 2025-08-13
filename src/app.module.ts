import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { SecretSantaModule } from './secret-santa/secret-santa.module';

@Module({
  imports: [CoreModule, SecretSantaModule],
})
export class AppModule {}
