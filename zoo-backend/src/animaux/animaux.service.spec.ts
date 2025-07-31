import { Test, TestingModule } from '@nestjs/testing';
import { AnimauxService } from './animaux.service';

describe('AnimauxService', () => {
  let service: AnimauxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnimauxService],
    }).compile();

    service = module.get<AnimauxService>(AnimauxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
