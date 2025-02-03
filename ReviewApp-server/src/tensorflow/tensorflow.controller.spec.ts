import { Test, TestingModule } from '@nestjs/testing';
import { TensorflowController } from './tensorflow.controller';

describe('TensorflowController', () => {
  let controller: TensorflowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TensorflowController],
    }).compile();

    controller = module.get<TensorflowController>(TensorflowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
