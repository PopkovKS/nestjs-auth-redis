import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { UsersService } from "../users/users.service";
// import { User } from './models/user.interface';

@Injectable()
export class AuthSerializer extends PassportSerializer {
    constructor(private readonly usersService: UsersService) {
        super();
    }
    serializeUser(user, done: (err: Error, user: { id: number; role: string }) => void) {
        done(null, { id: user.id, role: user.role });
    }

    deserializeUser(payload: { id: number; role: string }, done: (err: Error, user) => void) {
        const user = this.usersService.findById(payload.id);
        done(null, user);
    }
}