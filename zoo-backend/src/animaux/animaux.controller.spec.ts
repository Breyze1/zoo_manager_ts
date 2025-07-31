import { Test, TestingModule } from '@nestjs/testing';
import { AnimauxController } from './animaux.controller';

describe('AnimauxController', () => {
  let controller: AnimauxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnimauxController],
    }).compile();

    controller = module.get<AnimauxController>(AnimauxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
