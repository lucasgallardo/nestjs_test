import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import { PermissionsService } from '../permissions/permissions.service';
import { Model, Types } from 'mongoose';
import { RoleDto } from './dto/role-dto';
import { PermissionDto } from '../permissions/dto/permissions-dto';

@Injectable()
export class RolesService {
    constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    private permissionService: PermissionsService
    ){}

    async createRole(role: RoleDto) {

        const roleExists = await this.roleModel.findOne({
            name: role.name
        });

        if (roleExists) {
            throw new ConflictException('El rol ya existe');
        }

        const permissionsRole: Types.ObjectId[] = [];
        if (role.permissions && role.permissions.length > 0) {

            for (const permission of role.permissions) {

                const permissionFound = await this.permissionService.findPermissionByName(permission.name);

                if (!permissionFound) {
                    throw new ConflictException(`El permiso ${permission.name} no existe`)
                }

                permissionsRole.push(permissionFound._id);

            }

        }

        const r = new this.roleModel({
            name: role.name,
            permissions: permissionsRole
        });

        return r.save();

    }

    getRoles(name: string){
        const filter = {}
        if(name){
            filter['name'] = {
                $regex: name.trim(),
                $options: 'i'
            }
        }
        return this.roleModel.find(filter).populate('permissions');
    }

    findRoleByName(name: string) {
        return this.roleModel.findOne({
            name
        }).populate('permissions');
    }

    async updateRole(name: string, role: RoleDto) {

        const roleExists = await this.findRoleByName(name);

        if (roleExists) {

            const newRoleExists = await this.findRoleByName(role.name);

            if (newRoleExists && newRoleExists.name != name) {
                throw new ConflictException(`El rol ${newRoleExists.name} ya existe`)
            }

            const permissionsRole: Types.ObjectId[] = [];
            if (role.permissions && role.permissions.length > 0) {

                for (const permission of role.permissions) {

                    const permissionFound = await this.permissionService.findPermissionByName(permission.name);

                    if (!permissionFound) {
                        throw new ConflictException(`El permiso ${permission.name} no existe`)
                    }

                    permissionsRole.push(permissionFound._id);

                }

            }

            await roleExists.updateOne({
                name: role.name,
                permissions: permissionsRole
            })

            return this.findRoleByName(role.name);

        } else {
            return this.createRole(role);
        }

    }

    async addPermission(name: string, permission: PermissionDto) {

        // Buscamos si existe un rol
        const roleExists = await this.findRoleByName(name);

        // Si existe un rol
        if (roleExists) {

            // Buscamos si el permiso existe
            const permissionExists = await this.permissionService.findPermissionByName(permission.name);

            // Si el permiso existe
            if (permissionExists) {

                // Buscamos si existe ese permiso
                const permissionRoleExists = await this.roleModel.findOne({
                    name: roleExists.name,
                    permissions: {
                        $in: permissionExists._id
                    }
                })
                // Si no existe ese permiso en el rol, lo añado
                if (!permissionRoleExists) {
                    // Actualizo el rol
                    // $push: añade un elemento del array
                    await roleExists.updateOne({
                        $push: {
                            permissions: permissionExists._id
                        }
                    });
                    return this.findRoleByName(name);
                } else { // Si existe dentro del rol, lanzamos excepción
                    throw new ConflictException('El permiso ya existe en el rol');
                }

            } else { // Sino existe, lanzamos excepción
                throw new ConflictException('El permiso no existe');
            }

        } else { // Sino existe, lanzamos excepción
            throw new ConflictException('El rol no existe');
        }

    }

    async removePermission(name: string, permission: PermissionDto) {

        // Buscamos si existe un rol
        const roleExists = await this.findRoleByName(name);

        // Si existe un rol
        if (roleExists) {

            // Buscamos si el permiso existe
            const permissionExists = await this.permissionService.findPermissionByName(permission.name);

            // Si el permiso existe
            if (permissionExists) {

                // Buscamos si existe ese permiso
                const permissionRoleExists = await this.roleModel.findOne({
                    name: roleExists.name,
                    permissions: {
                        $in: permissionExists._id
                    }
                })
                // Si no existe ese permiso en el rol, lo añado
                if (permissionRoleExists) {
                    // Actualizo el rol
                    // $push: añade un elemento del array
                    await roleExists.updateOne({
                        $pull: {
                            permissions: permissionExists._id
                        }
                    });
                    return this.findRoleByName(name);
                } else { // Si existe dentro del rol, lanzamos excepción
                    throw new ConflictException('El permiso no existe en el rol');
                }

            } else { // Sino existe, lanzamos excepción
                throw new ConflictException('El permiso no existe');
            }

        } else { // Sino existe, lanzamos excepción
            throw new ConflictException('El rol no existe');
        }

    }

    async deleteRole(name: string){
        const roleExists = await this.findRoleByName(name);

        if(roleExists){
            return roleExists.deleteOne();
        }else{
            throw new ConflictException('El rol no existe');
        }
    }
}
