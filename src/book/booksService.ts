import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BookDocument, Book } from '../schemas/book.schema';
import { InjectModel } from '@nestjs/mongoose';
import CreateBookDto from 'src/dto/CreateBookDto';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private BookModel: Model<BookDocument>) {}

  public async getBooks(): Promise<BookDocument[]> {
    const books = await this.BookModel.find().select('-__v');
    return books;
  }

  public async createBook(data: CreateBookDto): Promise<BookDocument> {
    const book = await this.BookModel.create(data);
    return book;
  }

  public async getBookId(id: string): Promise<BookDocument | null> {
    const books = await this.BookModel.findById(id).select('-__v');
    return books;
  }

  async update(id: string, data: CreateBookDto): Promise<Book | null> {
    const books = await this.BookModel.findByIdAndUpdate(id, data).select(
      '-__v',
    );
    return books;
  }

  async delete(id: string) {
    const books = await this.BookModel.deleteOne({ _id: id }).exec();
    return books;
  }
}
