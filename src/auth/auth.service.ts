import {
    ConflictException, Injectable,
    InternalServerErrorException, Logger, UnauthorizedException 
} from '@nestjs/common';
import { User } from './uset.entity';
import * as bcrypt from 'bcrypt' ;
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCredentialsDto } from './dtos/user-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    private readonly logger = new Logger('AuthService') ;
    constructor (
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async singUp(userCredentialsDto: UserCredentialsDto): Promise<void> {
        const {username, password} = userCredentialsDto ;

        const user = new User() ;
        user.username = username ;
        user.salt = await bcrypt.genSalt() ;
        user.password = await this.hashPassword(password, user.salt) ;
        try {
            await user.save() ;
        } catch (error) {
            if (error.code === '23505' ) 
                throw new ConflictException('Username already exists..') ;
            else 
                throw new InternalServerErrorException() ;
        }
        return;
    }

    async singIn(userCredentialsDto:UserCredentialsDto): Promise< {accessToken: string} > {
        const username = await this.validateUserPassword(userCredentialsDto) ;
        if (!username) 
            throw new UnauthorizedException('Invalid credentials..') ;

        const payload:JwtPayload = { username } ;
        const accessToken = this.jwtService.sign(payload) ;
        this.logger.debug(`Generated JWT Token with payload as ${JSON.stringify(payload)}`)
        return { accessToken } ;
    }

    private async validateUserPassword(userCredentialsDto: UserCredentialsDto ): Promise<string> {
        const {username, password } = userCredentialsDto;
        const user = await this.userRepository.findOne( { where: {username} } ) ;

        if (!user) 
            return null

        const hash = await bcrypt.hash( password, user.salt) ;
        const validatePassword:boolean = hash === user.password ;

        if (validatePassword)
            return username ;
    
        return null 
    }
    private async hashPassword(password:string, salt:string ): Promise<string> {
        return bcrypt.hash(password,salt) ;
    }
}
