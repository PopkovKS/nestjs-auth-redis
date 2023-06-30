import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AccessTokenGuard } from "../auth/guards/access-token.guard";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@Controller("users")
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  @ApiOperation({ summary: "Getting all users" })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get(":id")
  @ApiOperation({ summary: "Gettings a user with specified id" })
  findById(@Param("id") id: string) {
    return this.usersService.findById(Number(id));
  }

  @UseGuards(AccessTokenGuard)
  @Patch(":id")
  @ApiOperation({ summary: "Updates a user with specified id" })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(Number(id), updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(":id")
  @ApiOperation({ summary: "Deletes a user with specified id" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(Number(id));
  }
}
