import { Test, TestingModule } from '@nestjs/testing';
import { RecoleccionesService } from './recolecciones.service';

describe('RecoleccionesService', () => {
  let service: RecoleccionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecoleccionesService],
    }).compile();

    service = module.get<RecoleccionesService>(RecoleccionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
