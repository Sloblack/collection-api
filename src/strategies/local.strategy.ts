import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "src/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'telefono',
            passwordField: 'contrasenia'
        });
    }

    async validate(telefono:string, contrasenia: string): Promise<any> {
        const user = await this.authService.validateUser(telefono, contrasenia);
        if (!user) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }
        return user;
    }
}