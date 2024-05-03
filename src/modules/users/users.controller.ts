import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user-dto';
import { GreaterZeroPipe } from 'src/pipes/greater-zero/greater-zero.pipe';
import { UserRoleDto } from './dto/user-role-dto';
// import { GreaterZeroPipe } from 'src/pipes/greater-zero/greater-zero.pipe';
// import { UserRoleDto } from './dto/user-role-dto';

@Controller('/api/v1/users')
export class UsersController {

    constructor(private userService: UsersService) { }

    @Post()
    createUser(@Body() user: UserDto) {
        return this.userService.createUser(user);
    }

    @Get()    
    getUsers(
        @Query('page', GreaterZeroPipe) page: number,
        @Query('size', GreaterZeroPipe) size: number,
        @Query('sortBy') sortBy: string,
        @Query('sort') sort: string
    ) {
        return this.userService.getUsers(page, size, sortBy, sort);
    }

    // @Get('/actives')
    // getUsersActives(
    //     @Query('page', GreaterZeroPipe) page: number,
    //     @Query('size', GreaterZeroPipe) size: number,
    //     @Query('sortBy') sortBy: string,
    //     @Query('sort') sort: string
    // ) {
    //     return this.userService.getUsers(page, size, sortBy, sort, false);
    // }

    // @Get('/deleted')
    // getUsersDeleted(
    //     @Query('page', GreaterZeroPipe) page: number,
    //     @Query('size', GreaterZeroPipe) size: number,
    //     @Query('sortBy') sortBy: string,
    //     @Query('sort') sort: string
    // ) {
    //     return this.userService.getUsers(page, size, sortBy, sort, true);
    // }

    @Put('/:usercode')
    updateUser(@Param('usercode') userCode: number, @Body() user: UserDto) {
        return this.userService.updateUser(userCode, user);
    }

    @Patch('/add-role')
    addRole(@Body() userRole: UserRoleDto) {
        return this.userService.addRole(userRole);
    }

    @Patch('/remove-role/:usercode')
    removeRole(@Param('usercode') userCode: number) {
        return this.userService.removeRole(userCode);
    }

    // @Patch('/restore/:usercode')
    // restoreUser(@Param('usercode') userCode: number) {
    //     return this.userService.restoreUser(userCode);
    // }

    // @Delete('/:usercode')
    // deleteUser(@Param('usercode') userCode: number) {
    //     return this.userService.deleteUser(userCode);
    // }

}
