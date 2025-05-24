import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateContenedorDto } from './dto/create-contenedor.dto';
import { UpdateContenedorDto } from './dto/update-contenedor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contenedor } from './entities/contenedor.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Ruta } from 'src/rutas/entities/ruta.entity';


@Injectable()
export class ContenedoresService {
  constructor(
    @InjectRepository(Contenedor)
    private contenedoresRepository: Repository<Contenedor>,
    @InjectRepository(Ruta)
    private rutasRepository: Repository<Ruta>,
  ) {}

  async create(createContenedorDto: CreateContenedorDto): Promise<Contenedor> {
    const contenedor = this.contenedoresRepository.create(createContenedorDto);
    return this.contenedoresRepository.save(contenedor);
  }

  async findAll(): Promise<Contenedor[]> {
    return this.contenedoresRepository.find({
      relations: ['puntoRecoleccion', 'puntoRecoleccion.ruta'],
    });
  }

  async findOne(id: number): Promise<Contenedor> {
    const contenedor = await this.contenedoresRepository.findOne({
      where: { contenedor_ID: id },
      relations: ['puntoRecoleccion'],
    });
    if (!contenedor) {
      throw new NotFoundException(`Contenedor con ID ${id} no encontrado`);
    }
    return contenedor;
  }

  async findByQR(codigo_QR: string): Promise<Contenedor> {
    const contenedor = await this.contenedoresRepository.findOne({
      where: { codigo_QR: codigo_QR }
    });
    if (!contenedor) {
      throw new NotFoundException(`Contenedor con QR: ${codigo_QR} no encontrado`);
    }
    return contenedor;
  }

  async findByNFC(NFC: string): Promise<Contenedor> {
    const contenedor = await this.contenedoresRepository.findOne({
      where: { codigo_NFC: NFC }
    });
    if (!contenedor) {
      throw new NotFoundException(`Contenedor con NFC: ${NFC} no encontrado`);
    }
    return contenedor;
  }

  async update(
    id: number,
    updateContenedorDto: UpdateContenedorDto,
  ): Promise<Contenedor> {
    const contenedor = await this.findOne(id);
    Object.assign(contenedor, updateContenedorDto);
    return this.contenedoresRepository.save(contenedor);
  }

  async remove(id: number): Promise<void> {
    const result = await this.contenedoresRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contenedor con ID ${id} no encontrado`);
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async actualizarEstadosRecoleccion() {
    const now = new Date();
    const currentTime = now.getTime();

    const rutas = await this.rutasRepository.find({
      relations: ['puntosRecoleccion', 'puntosRecoleccion.contenedor'],
    });

    for (const ruta of rutas) {
      const [hours, minutes] = ruta.hora_actualizacion.split(':').map(Number);
      const rutaUpdateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes).getTime();

      if (currentTime >= rutaUpdateTime && currentTime < rutaUpdateTime + 5 * 60 * 1000) {
        for (const punto of ruta.puntosRecoleccion) {
          if (punto.contenedor) {
            punto.contenedor.estadoRecoleccion = false;
            punto.contenedor.ultima_actualizacion = now;
            await this.contenedoresRepository.save(punto.contenedor);
          }
        }
        console.log(`Estados de recolección actualizados para la ruta: ${ruta.nombre_ruta}`);
      }
    }
  }

  async findContenedor(codigo: string): Promise<Contenedor> {
    const contenedor = await this.contenedoresRepository.findOne({
      where: [
        { codigo_QR: codigo },
        { codigo_NFC: codigo }
      ],
      relations: ['puntoRecoleccion']
    });
    if (!contenedor) {
      throw new NotFoundException(`Contenedor no encontrado`);
    }
    return contenedor;
  }

  async actualizarEstadoContenedor(id: number, estadoRecoleccion: boolean): Promise<Contenedor> {
    const contenedor = await this.findOne(id);
    contenedor.estadoRecoleccion = estadoRecoleccion;
    contenedor.ultima_actualizacion = new Date();
    return this.contenedoresRepository.save(contenedor);
  }
}
