import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ContenedoresModule } from './contenedores/contenedores.module';
import { RutasModule } from './rutas/rutas.module';
import { RecoleccionesModule } from './recolecciones/recolecciones.module';
import { PuntosRecoleccionModule } from './puntos-recoleccion/puntos-recoleccion.module';
import { APP_PIPE, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DateTransformInterceptor } from './interceptors/date-transform.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT') || 5432,
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: false,
        extra: {
          ssl:true,
          options: `-c timezone=America/Mexico_City`
        }
      })
    }),
    UsuariosModule,
    ContenedoresModule,
    RutasModule,
    RecoleccionesModule,
    PuntosRecoleccionModule,
    AuthModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DateTransformInterceptor,
    },
  ],
})
export class AppModule {}
