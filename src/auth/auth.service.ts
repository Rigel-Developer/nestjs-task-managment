import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignupResponseDto } from './dto/signup-response.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersRepository)
        private userRepository: UsersRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.createUser(authCredentialsDto);
    }
    async signIn(
        authCredentialsDto: AuthCredentialsDto,
    ): Promise<{ accessToken: string }> {
        const { username, password } = authCredentialsDto;
        const user = await this.userRepository.findOne({ username });
        const pass = await bcrypt.compare(password, user.password);
        if (user && pass) {
            //generate JWT and return to client
            const payload: JwtPayload = { username };
            const accessToken: string = await this.jwtService.sign(payload);
            return { accessToken };
        } else {
            throw new UnauthorizedException(
                'Please check your login credentials',
            );
        }
    }
}
