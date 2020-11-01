import { ObjectId } from 'mongodb';
import { HttpStatus } from '@nestjs/common';
import { BookStatus, Schema$Book } from '@/typings';
import { UpdateBookDto } from '@/modules/book/dto';
import { rid } from '@/utils/rid';
import { setupUsers } from '../../service/auth';
import { updateBook, createBookDto, createBook } from '../../service/book';

const tags = () => [rid(5), rid(5)].map(s => s.toLowerCase());

export function testUpdateBook() {
  let book: Schema$Book;

  beforeAll(async () => {
    await setupUsers();
    const response = await createBook(author.token);
    book = response.body;
  });

  test.each(['root', 'admin', 'author'])('%s can update book', async user => {
    const params: UpdateBookDto[] = [
      { title: rid(10) },
      { category: rid(5) },
      { description: rid(5) },
      { tags: tags() },
      createBookDto({
        description: rid(10),
        category: 'ohters',
        tags: tags()
      })
    ];

    for (const payload of params) {
      const response = await updateBook(global[user].token, book.id, payload);
      expect(response.error).toBeFalse();
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        ...payload,
        status: BookStatus.Pending
      });

      if (user === 'author') {
        expect(response.body.author).toEqual({
          nickname: author.user.nickname
        });
      }
    }
  });

  test.each(['client'])('%s cannot update book', async user => {
    const response = await updateBook(
      global[user].token,
      book.id,
      createBookDto()
    );
    expect(response.status).toBe(HttpStatus.FORBIDDEN);
  });

  test.each`
    property    | value
    ${'status'} | ${BookStatus.Approved}
    ${'author'} | ${new ObjectId().toHexString()}
  `(
    '$property will not be update',
    async ({ property, value }: Record<string, string>) => {
      const response = await updateBook(author.token, book.id, {
        [property]: value
      });
      expect(response.error).toBeFalse();
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).not.toHaveProperty(property, value);
    }
  );
}
