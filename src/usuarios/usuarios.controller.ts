import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Usuario } from './entities/usuario.entity';
import { Ruta } from 'src/rutas/entities/ruta.entity';
import { Recoleccion } from 'src/recolecciones/entities/recoleccion.entity';
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrador')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
  @Post(':id/change-password')
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usuariosService.updatePassword(
      id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );

    return { message: 'Contraseña actualizada correctamente' };
  }

  @Post(':usuarioId/rutas/:rutaId')
  async assignRoute(
    @Param('usuarioId') usuarioId: number,
    @Param('rutaId') rutaId: number,
  ): Promise<Usuario> {
    return this.usuariosService.assignUserRoute(usuarioId, rutaId);
  }

  @Delete(':usuarioId/rutas/:rutaId')
  async unassignRoute(
    @Param('usuarioId') usuarioId: number,
    @Param('rutaId') rutaId: number,
  ): Promise<Usuario> {
    return this.usuariosService.unassignUserRoute(usuarioId, rutaId);
  }
  
  @Get(':usuarioId/rutas')
  async obtainRoutes(@Param('usuarioId') usuarioId: number): Promise<Ruta[]> {
    return this.usuariosService.obtainUserRoutes(usuarioId);
  }

  @Get(':rutaId/usuarios')
  async obtainUsersRoute(@Param('rutaId') rutaId: number): Promise<Usuario[]> {
    return this.usuariosService.obtainUsersRoute(rutaId);
  }

  @Get(':usuarioId/recolecciones')
  async obtainUserRecollections(@Param('usuarioId') usuarioId: number): Promise<Recoleccion[]> {
    return this.usuariosService.obtainUserRecollections(usuarioId);
  }

  @Get(':telefono/restore-password')
  async restorePassword(@Param('telefono') telefono: string): Promise<Usuario> {
    return this.usuariosService.restorePassword(telefono);
  }
}
