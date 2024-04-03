import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dtos/user-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './user.docorator';
import { User } from './uset.entity';

@Controller('auth')
export class AuthController {
    constructor (
        private authService:AuthService
    ) {}

    @Post('/singup')
    singUp(@Body(ValidationPipe) userCredentialsDto: UserCredentialsDto) {
        return this.authService.singUp(userCredentialsDto) ;
    }

    @Post('/singin') 
    singIn(@Body(ValidationPipe) userCredentialsDto:UserCredentialsDto): Promise< {accessToken: string} > {
        return this.authService.singIn(userCredentialsDto) ;
    }

    @Post('/test') 
    @UseGuards(AuthGuard()) 
    test (@GetUser() user:User) {
        console.log(user) ;
    }

}