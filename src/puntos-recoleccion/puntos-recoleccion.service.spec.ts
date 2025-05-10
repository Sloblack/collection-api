import { Test, TestingModule } from '@nestjs/testing';
import { PuntosRecoleccionService } from './puntos-recoleccion.service';

describe('PuntosRecoleccionService', () => {
  let service: PuntosRecoleccionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PuntosRecoleccionService],
    }).compile();

    service = module.get<PuntosRecoleccionService>(PuntosRecoleccionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
