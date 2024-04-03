import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtPayload } from "./jwt-payload.interface";
import { Strategy, ExtractJwt } from 'passport-jwt' ;
import { User } from "./uset.entity";
import { Repository } from "typeorm";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as config from 'config' ;

const jwtConfig = config.get('jwt') ;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor (
        @InjectRepository(User) private userRepository: Repository<User>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: jwtConfig.ignoreExpiration ,
            secretOrKey: process.env.JWT_SECRET || jwtConfig.secret ,
        });
    }

    async validate(payload:JwtPayload) {
        const {username} = payload ;
        const user = await this.userRepository.findOne( { where: {username} } ) ;

        if (!user) 
            throw new UnauthorizedException();
        return user ;
    }
}