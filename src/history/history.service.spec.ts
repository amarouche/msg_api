import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { strict } from 'assert/strict';
import Message from 'src/message/message.entity';
import { MessageService } from 'src/message/message.service';
import { mockHistoryRepository, mockMessageRepository } from './../../test/mockRepository';
import History from './history.entity';
import { HistoryService } from './history.service';

describe('HistoryService', () => {
  let service: HistoryService;
  const mockedUser = {
    id:1,
    email:"ouahab@amarouche.com"
  }
  const mockedMessageId= 1
    
  const mockedNewMessage = "hello"
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryService, MessageService,
        {
          provide: getRepositoryToken(History),
          useValue: mockHistoryRepository,
        },
        {
          provide: getRepositoryToken(Message),
          useValue: mockMessageRepository,
        }
      ],
    }).compile();

    service = module.get<HistoryService>(HistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be return history',async () => {
    const dto = {
     id:1
    }
    mockHistoryRepository.findOne.mockReturnValue(dto)
    expect(await service.findOne(dto.id)).toEqual({id:1});
  });

  it('should be return user\'s messages history',async () => {
    const dto = {
     email:"test@test.com"
    }
    mockHistoryRepository.find.mockReturnValue(dto)
    expect(await service.getUserMessagesHistory(dto)).toEqual(dto);
  });


  it('should be return new & archived messages',async () => {
    mockMessageRepository.findOne.mockReturnValue(
      {id: mockedMessageId,
      userSender:{id:1}})
    mockHistoryRepository.save.mockReturnValue({
      archivedMessage:"test",
      user:mockedUser,
      message:mockedNewMessage
    })
    mockMessageRepository.save.mockReturnValue({
      id: mockedMessageId,
      userSender:{id:1},
      messageBody:mockedNewMessage
    })
    expect(await service.editAndArchiveMessage(mockedUser,mockedMessageId,mockedNewMessage)).toEqual({
      archived: "test",
      newMessage: mockedNewMessage,
    });
  });
});
