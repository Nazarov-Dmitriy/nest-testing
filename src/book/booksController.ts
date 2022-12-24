import {
  Controller,
  Get,
  Render,
  Post,
  Body,
  Redirect,
  Param,
} from '@nestjs/common';
import { BooksService } from './booksService';
import CreateBookDto from '../dto/CreateBookDto';
import { BookDocument } from '../schemas/book.schema';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @Render('books/index')
  public async getBooks() {
    const books: BookDocument[] = await this.booksService.getBooks();

    return {
      title: 'Книги',
      books: books,
    };
  }

  @Get('/create')
  @Render('books/create')
  root() {
    return {
      title: 'Создать книгу',
      book: {},
    };
  }

  @Post('/create')
  @Redirect('/books')
  createBook(@Body() CreateBookDto: CreateBookDto): Promise<BookDocument> {
    return this.booksService.createBook(CreateBookDto);
  }

  @Get(':id')
  @Render('books/view')
  async getBookId(@Param('id') id: string) {
    const book = await this.booksService.getBookId(id);

    if (book === null) {
      Redirect('/404');
    }
    return {
      title: 'Книга ',
      book: book,
    };
  }

  @Get('/update/:id')
  @Render('books/update')
  async updateForm(@Param('id') id: string) {
    const book = await this.booksService.getBookId(id);
    if (book === null) {
      Redirect('/404');
    }
    return {
      title: 'Редактировать книгу',
      book: book,
    };
  }

  @Post('/update/:id')
  @Redirect('/books')
  update(@Param('id') id: string, @Body() CreateBookDto: CreateBookDto) {
    const book = this.booksService.update(id, CreateBookDto);
    if (book === null) {
      Redirect('/404');
    }
  }

  @Post('/remove/:id')
  @Redirect('/books')
  delete(@Param('id') id: string) {
    const book = this.booksService.delete(id);
    if (book === null) {
      Redirect('/404');
    }
  }
}
