import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { configValidationSchema } from './config.schema';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [`.env.stage.${process.env.STAGE}`],
            validationSchema: configValidationSchema,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                autoLoadEntities: true,
                synchronize: true,
            }),
        }),
        TaskModule,
        ConfigModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
