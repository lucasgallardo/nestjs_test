import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { PermissionDto } from "src/modules/permissions/dto/permissions-dto";

export class RoleDto {

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsArray()
    @IsOptional()
    @Type(()=> PermissionDto)
    permissions?: PermissionDto[] = [];
}