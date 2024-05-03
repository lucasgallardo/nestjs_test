import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, permissionsSchema } from './schemas/permissions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Permission.name,
        schema: permissionsSchema
      }
    ])
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService]
})
export class PermissionsModule {}
