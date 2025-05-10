import { Test, TestingModule } from '@nestjs/testing';
import { RecoleccionesController } from './recolecciones.controller';
import { RecoleccionesService } from './recolecciones.service';

describe('RecoleccionesController', () => {
  let controller: RecoleccionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecoleccionesController],
      providers: [RecoleccionesService],
    }).compile();

    controller = module.get<RecoleccionesController>(RecoleccionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
