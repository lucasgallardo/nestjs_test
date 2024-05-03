import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUppercase } from "class-validator";

export class UserRoleDto {

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    userCode: number;

    @IsString()
    @IsUppercase()
    @IsNotEmpty()
    roleName: string;
}