import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessageService } from 'src/message/message.service';
import { User } from './user.entity';
import { UserService } from './user.service';
import { mockMessageRepository, mockUserRepository } from '../../test/mockRepository';
import Message from 'src/message/message.entity';


describe('UserService', () => {
  
  let service: UserService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,MessageService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Message),
          useValue: mockMessageRepository,
        },
        
        
    ]}).compile();
    
    service = module.get<UserService>(UserService);
  });
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be find user', () => {
    const dto = {
      id:1,
    }
    mockUserRepository.findOne.mockReturnValue(dto)
    expect(service.findOne(dto.id)).toEqual(dto);
    expect(mockUserRepository.findOne).toHaveBeenCalledWith(dto.id);
  });
});

