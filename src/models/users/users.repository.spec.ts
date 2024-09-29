import { Test } from '@nestjs/testing';
import { createId } from '@paralleldrive/cuid2';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '@/database/prisma.service';
import { UsersRepository } from './users.repository';

describe(`UsersRepository`, () => {
  let usersRepository: UsersRepository;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    usersRepository = moduleRef.get(UsersRepository);
    prismaService = moduleRef.get(PrismaService);
  });

  describe(`createUser`, () => {
    it(`should create a new user`, async () => {
      // Arrange
      const mockedUser = {
        id: createId(),
        username: `testuser`,
        name: `Test User`,
        email: `testuser@abc.com`,
        password: `password`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaService.user.create.mockResolvedValue(mockedUser);

      // Act
      const createUser = () => usersRepository.createUser({ ...mockedUser });

      // Assert
      await expect(createUser()).resolves.toBe(mockedUser);
    });
  });
});
