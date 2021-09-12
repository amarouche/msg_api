export const mockAuthRepository = {
  save: jest.fn(),
  createOne: jest.fn(),
  findOne: jest.fn(),
  metadata: {
    connection: {
      options: {
         type: '',
        },
      relations: [],
    },
    columns:[
    ]
  }
};

export const mockUserRepository = {
  save: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  createOne: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
  metadata: {
    connection: {
      options: {
         type: '',
        },
      relations: [],
    },
    columns:[
    ]
  }
};
export const mockMessageRepository ={
  save: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  createOne: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  findOneOrFail:jest.fn(),
  softDelete: jest.fn(),
  metadata: {
    connection: {
      options: {
         type: '',
        },
      relations: [],
    },
    columns:[
    ]
  }
};

export const mockHistoryRepository = {
  save: jest.fn(),
  createOne: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  metadata: {
    connection: {
      options: {
         type: '',
        },
      relations: ['message','user'],
    },
    columns:[
    ]
  }
};
