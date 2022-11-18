import { Test, TestingModule } from '@nestjs/testing';
import { BargainGateway } from './bargain.gateway';

describe('BargainGateway', () => {
  let gateway: BargainGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BargainGateway],
    }).compile();

    gateway = module.get<BargainGateway>(BargainGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
