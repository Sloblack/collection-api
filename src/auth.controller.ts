import { Body, Controller, Post, UseGuards, Request, Get } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateUsuarioDto } from "./usuarios/dto/create-usuario.dto";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "./decorators/roles.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiBody({ type: CreateUsuarioDto })
    @ApiResponse({ status: 201, description: 'Usuario creado exitosamente'})
    @ApiResponse({ status: 400, description: 'Datos inválidos'})
    @Post('register')
    async register(@Body() createUsuarioDto: CreateUsuarioDto) {
        return this.authService.register(createUsuarioDto);
    }

    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                telefono: { type: 'string', example: '5553334444' },
                contrasenia: { type: 'string', example: 'password1234' },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'Login exitoso' })
    @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @ApiOperation({ summary: 'Obtener perfil de usuario autentificado' })
    @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @ApiOperation({ summary: 'Ruta protegida solo para administradores' })
    @ApiResponse({ status: 200, description: 'Acceso permitido' })
    @ApiResponse({ status: 401, description: 'Acceso denegado' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('administrador')
    @Get('admin')
    getAdminData() {
        return { message: 'Esta es una ruta protegida para administradores' }
    }
}