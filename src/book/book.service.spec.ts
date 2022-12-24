import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Book } from '../schemas/book.schema';
import { BooksController } from './booksController';
import { BooksService } from './booksService';
import { Model } from 'mongoose';

const mockBook = {
  title: 'book1',
  description: 'book1',
  authors: 'book1',
  favorite: 'book1',
  fileCover: 'book1',
  fileName: 'book1',
};

describe('BooksService', () => {
  let booksService: BooksService;
  let BookModel: Model<Book>;

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

  const booksFindArray = [
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
  ];

  const bookUpdateArray = [
    {
      title: 'book3',
      description: 'book1',
      authors: 'book1',
      favorite: 'book1',
      fileCover: 'book1',
      fileName: 'book1',
      fileBook: 'book1',
    },
  ];

  beforeEach(async () => {
    const book: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
        {
          provide: getModelToken('Book'),
          useValue: {
            new: jest.fn().mockResolvedValue(booksArray),
            constructor: jest.fn().mockResolvedValue(booksArray),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
            exec: jest.fn(),
            select: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    booksService = await book.resolve<BooksService>(BooksService);
    BookModel = book.get<Model<Book>>(getModelToken(Book.name));
  });

  it('should return all books', async () => {
    jest.spyOn(BookModel, 'find').mockReturnValue({
      select: jest.fn().mockResolvedValueOnce(booksArray),
    } as any);
    const books = await booksService.getBooks();
    expect(books).toEqual(booksArray);
  });

  it('add a new book', async () => {
    jest.spyOn(BookModel, 'create').mockImplementation(() =>
      Promise.resolve({
        title: 'book1',
        description: 'book1',
        authors: 'book1',
        favorite: 'book1',
        fileCover: 'book1',
        fileName: 'book1',
      }),
    );

    const newBook = await booksService.createBook({
      title: 'book1',
      description: 'book1',
      authors: 'book1',
      favorite: 'book1',
      fileCover: 'book1',
      fileName: 'book1',
    });

    await expect(newBook).toEqual(mockBook);
  });

  it(' search on id ', async () => {
    jest.spyOn(BookModel, 'findById').mockReturnValue({
      select: jest.fn().mockResolvedValueOnce(booksFindArray),
    } as any);
    const book = await booksService.getBookId('1');
    expect(book).toEqual(booksFindArray);
  });

  it('update book ', async () => {
    jest.spyOn(BookModel, 'findByIdAndUpdate').mockReturnValue({
      select: jest.fn().mockResolvedValueOnce(bookUpdateArray),
    } as any);
    const book = await booksService.update('1', {
      title: 'book3',
      description: 'book1',
      authors: 'book1',
      favorite: 'book1',
      fileCover: 'book1',
      fileName: 'book1',
    });
    expect(book).toEqual(bookUpdateArray);
  });

  it('test delete book ', async () => {
    jest.spyOn(BookModel, 'deleteOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockBook),
    } as any);
    const book = await booksService.delete('2');
    expect(book).toEqual(mockBook);
  });
});
