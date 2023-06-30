import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { LocalGuard } from "./guards/local-auth.guard";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { AccessTokenGuard } from "./guards/access-token.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("registration")
  registration(@Body() createUserDto: CreateUserDto) {
    return this.authService.registration(createUserDto);
  }

  @UseGuards(LocalGuard)
  @Post("login")
  async login(@Request() req) {
    const logUser = await this.authService.login(req.user)
    // return this.authService.login(req.user);
    return [req.session, logUser];
  }

  // @UseGuards(RefreshTokenGuard)
  // @Get("refresh")
  // @ApiOperation({ summary: "Getting refresh token" })
  // refreshTokens(@Req() req) {
  //   const userId = req.user["id"];
  //   const refreshToken = req.user["refresh_token"];
  //   return this.authService.refreshTokens(userId, refreshToken);
  // }

  @UseGuards(AccessTokenGuard)
  @Get("logout")
  logout(@Request() req) {
    this.authService.logout(req.user["id"]);
    req.session.cookie.maxAge = 0
  }
}
