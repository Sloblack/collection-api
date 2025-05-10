import { Test, TestingModule } from '@nestjs/testing';
import { PuntosRecoleccionController } from './puntos-recoleccion.controller';
import { PuntosRecoleccionService } from './puntos-recoleccion.service';

describe('PuntosRecoleccionController', () => {
  let controller: PuntosRecoleccionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuntosRecoleccionController],
      providers: [PuntosRecoleccionService],
    }).compile();

    controller = module.get<PuntosRecoleccionController>(
      PuntosRecoleccionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
