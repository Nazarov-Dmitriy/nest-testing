import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { BooksService } from '../src/book/booksService';
import { BooksController } from '../src/book/booksController';
import { BookModule } from '../src/book/book.module';
import { Book } from '../src/schemas/book.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('Books (e2e)', () => {
  let books: INestApplication;
  let booksService: BooksService;
  let BookModel: Model<Book>;
  let booksController: BooksController;

  const booksArray = [
    {
      id: '1',
      title: 'book1',
      description: 'book1',
      authors: 'book1',
      favorite: 'book1',
      fileCover: 'book1',
      fileName: 'book1',
      fileBook: 'book1',
    },
    {
      id: '2',
      title: 'book2',
      description: 'book2',
      authors: 'book2',
      favorite: 'book2',
      fileCover: 'book2',
      fileName: 'book2',
      fileBook: 'book2',
    },
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
        {
          provide: getModelToken('Book'),
          useValue: {
            select: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    booksService = await moduleFixture.resolve<BooksService>(BooksService);
    booksController = moduleFixture.get<BooksController>(BooksController);
    BookModel = moduleFixture.get<Model<Book>>(getModelToken(Book.name));

    books = moduleFixture.createNestApplication();
    await moduleFixture.init();
  });

  it('/books (GET)', async () => {
    jest.spyOn(BookModel, 'find').mockReturnValue({
      select: jest.fn().mockResolvedValueOnce(booksArray),
    } as any);
    const arrBooks = await booksService.getBooks();

    return request(books.getHttpServer())
      .get('/books')
      .expect(200)
      .expect({ title: 'Книги', books: arrBooks });
  });

  afterAll(async () => {
    await books.close();
  });
});
