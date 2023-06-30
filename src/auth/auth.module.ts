import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PasswordService } from '../services/password.service';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { AuthController } from './auth.controller';
import { AuthSerializer } from './serialization';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({}),
        PassportModule.register({
            session: true,
        })],
    controllers: [AuthController],
    providers: [
        AuthService,
        PasswordService,
        LocalStrategy,
        AccessTokenStrategy,
        AuthSerializer,
    ],
    exports: [AuthService, PasswordService],
})
export class AuthModule {
}
