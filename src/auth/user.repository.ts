import { Entity, EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignupResponseDto } from './dto/signup-response.dto';
import {
    ConflictException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        //: Promise<SignupResponseDto>
        const { username, password } = authCredentialsDto;

        //Generate hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.create({ username, password: hashedPassword });
        try {
            await this.save(user);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new ConflictException(
                    `The username ${username}  alredy exists`,
                );
            } else {
                Logger.error(error);
                throw new InternalServerErrorException();
            }
        }
    }
}
