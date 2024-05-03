import { IsNotEmpty, IsString } from "class-validator";

export class PermissionDto {

    @IsString()
    @IsNotEmpty()
    name!: string;
}