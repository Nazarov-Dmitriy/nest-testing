import { Module } from '@nestjs/common';
import { BooksService } from './booksService';
import { BooksController } from './booksController';
import { BookSchema, Book } from '../schemas/book.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BookModule {}
