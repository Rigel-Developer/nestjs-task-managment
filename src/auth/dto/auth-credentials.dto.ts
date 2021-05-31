import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4, { message: 'La contraseña debe tener al menos 4 caracteres' })
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password is to weak', //se puede pasar un segundo argumento para generar un mensaje personalizado
    })
    password: string;
}
