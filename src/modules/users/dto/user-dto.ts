import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { RoleDto } from "src/modules/roles/dto/role-dto";

export class UserDto {

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    birthdate!: Date;

    @Type(() => RoleDto)
    @IsOptional()
    @IsObject()
    role?: RoleDto;
}