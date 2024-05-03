import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePermissionDto {

    @IsString()
    @IsNotEmpty()
    originalName: string;
    
    @IsString()
    @IsNotEmpty()
    newName: string;
}