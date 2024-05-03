import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionDto } from './dto/permissions-dto';
import { UpdatePermissionDto } from './dto/permission-update.dto';

@Controller('/api/v1/permissions')
export class PermissionsController {
    constructor(private permissionsService: PermissionsService){}

    @Post()
    createPermission(@Body() permission: PermissionDto){
        return this.permissionsService.createPermision(permission);
    }

    @Get()
    getPermissions(@Query('name') name: string){
        return this.permissionsService.getPermissions(name);
    }

    @Put()
    updatePermission(@Body() updatePermission: UpdatePermissionDto){
        return this.permissionsService.updatePermission(updatePermission);
    }

    @Delete("/:name")
    deletePermission(@Param('name') name: string){
        return this.permissionsService.deletePermission(name);
    }
}
