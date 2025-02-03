import { Test, TestingModule } from '@nestjs/testing';
import { TensorflowService } from './tensorflow.service';

describe('TensorflowService', () => {
  let service: TensorflowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TensorflowService],
    }).compile();

    service = module.get<TensorflowService>(TensorflowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
