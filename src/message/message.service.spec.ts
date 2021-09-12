import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { mockMessageRepository, mockUserRepository } from './../../test/mockRepository';
import { TYPE_MSG } from './dto/message.dto';
import Message from './message.entity';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;
  const mockedMessage = {
    id:1,
    objet: "email",
    type: TYPE_MSG.EMAIL,
    messageBody: "bonjour",
    userReceiver: {
      email: "user@receiver.com",
    },
    userSender: {
      email: "user@sender.com",
    }
  }
  const userDto = { email: "user@sender.com"}
  const messageAnsweredId = 1
  const req: CrudRequest = { parsed: null, options: null };

  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageService,UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,

        },
        {
          provide: getRepositoryToken(Message),
          useValue: mockMessageRepository,
        },],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create new message', async() => {
    mockMessageRepository.save.mockReturnValue(mockedMessage)
    expect(await service.createOrUpdateMessage (userDto,mockedMessage)).toEqual(mockedMessage);
    expect(mockMessageRepository.save).toHaveBeenCalledTimes(1)
  });
  
  it('should be return answerd message', async() => {
    mockMessageRepository.findOneOrFail.mockReturnValue({
      relations: ['userReceiver','userSender'],
      where: { id: messageAnsweredId }
    })
    expect(await service.answerToMessage(userDto,messageAnsweredId,mockedMessage)).toEqual(mockedMessage);
    expect(mockMessageRepository.findOneOrFail).toHaveBeenCalledTimes(1)
  });

  it('should be find message', async () => {
    mockMessageRepository.findOne.mockReturnValue(mockedMessage)
    expect(await service.findOne(messageAnsweredId)).toEqual(mockedMessage);
    expect(mockMessageRepository.findOne).toHaveBeenCalledTimes(1)
  });


  it('should be find All', async () => {
    const params = {
      messageType:'sms'
    }
    mockMessageRepository.find.mockResolvedValue([]);
    mockMessageRepository.findOne.mockReturnValue(params)
    expect(await service.getMessages()).toEqual(expect.objectContaining([]));
    expect(mockMessageRepository.find).toHaveBeenCalledTimes(1);
  });


  it('should be remove message', async () => {
    const removeArgs = 1;
    const softDelete = { id: 1 };
    mockMessageRepository.softDelete.mockResolvedValue(softDelete);
    expect(await service.markDeleted(removeArgs)).toEqual({
      id:removeArgs,
      message : 'message was soft deleted'
    });
    expect(mockMessageRepository.softDelete).toHaveBeenCalledTimes(1);
  });
});
