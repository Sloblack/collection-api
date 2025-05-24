import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsuariosService } from "./usuarios/usuarios.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private usuariosService: UsuariosService,
        private jwtServicce: JwtService,
    ){}

    async validateUser(telefono: string, contrasenia: string): Promise<any> {
        const user = await this.usuariosService.findByTelefono(telefono);
        if (user && await user.validatePassword(contrasenia)) {
            const { contrasenia, ...result} = user;
            return result;
        }
        return null
    }

    async login(user: any) {
        const payload = { username: user.nombre, sub:user.usuario_ID, rol: user.rol};
        return {
            user: {
                id: user.usuario_ID,
                nombre: user.nombre,
                rol: user.rol,
                telefono: user.telefono,
            },
            accessToken: this.jwtServicce.sign(payload),
        };
    }

    async register(userData: {
        nombre:string,
        contrasenia:string,
        telefono: string,
        rol: 'recolector' | 'administrador' | 'invitado'
    }) {
        const existingUser = await this.usuariosService.findByTelefono(userData.telefono);
        if (existingUser) {
            throw new UnauthorizedException('El numero de teléfono ya está registrado');
        }
        const newUser = await this.usuariosService.create(userData);

        const {contrasenia, ...result} = newUser;
        return result;
    }
}