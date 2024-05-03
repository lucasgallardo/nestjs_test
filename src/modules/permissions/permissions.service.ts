import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './schemas/permissions.schema';
import { Model } from 'mongoose';
import { PermissionDto } from './dto/permissions-dto';
import { UpdatePermissionDto } from './dto/permission-update.dto';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectModel(Permission.name) private permissionModel: Model<Permission>
    ){}

    async createPermision(permission: PermissionDto){
        const permissionExists = await this.findPermissionByName(permission.name);
         
        if(permissionExists){
            throw new ConflictException("El permiso existe");
        }

        const p = new this.permissionModel(permission);

        return p.save();
    }

    getPermissions(name: string){
        const filter = {}
        if(name){
            filter['name'] = {
                $regex: name.trim(),
                $options: 'i'
            };
        }
        return this.permissionModel.find(filter);
    }

    async updatePermission(updatePermission: UpdatePermissionDto){
        const permissionExists = await this.findPermissionByName(updatePermission.originalName);
        
        const newPermissionExists = await this.permissionModel.findOne({
            name: updatePermission.newName
        })

        if(permissionExists && !newPermissionExists){
            await permissionExists.updateOne({
                name: updatePermission.newName
            })
            return this.permissionModel.findById(permissionExists._id);
        }else if(!permissionExists){
            const permission = new PermissionDto();
            permission.name = updatePermission.originalName;
            return this.createPermision(permission);
        }else{
            throw new ConflictException("No se puede actualizar el permiso");
        }

    }

    async deletePermission(name: string){
        const permissionExists = await this.findPermissionByName(name);

        if(permissionExists){
            return permissionExists.deleteOne();
        }else{
            throw new ConflictException('El permiso no existe');
        }
    }

    findPermissionByName(name: string){
        return this.permissionModel.findOne({
            name
        })
    }
}
