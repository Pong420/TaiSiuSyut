import { ObjectId } from 'mongodb';
import { HttpStatus } from '@nestjs/common';
import { BookStatus } from '@/typings';
import { rid } from '@/utils/rid';
import { getGlobalUser, setupUsers } from '../../service/auth';
import { createBook, createBookDto, getBook } from '../../service/book';

const tags = () => [rid(5), rid(5)].map(s => s.toLowerCase());

export function testCreateBook() {
  beforeAll(async () => {
    await setupUsers();
  });

  test('author can create book', async () => {
    const params = [
      createBookDto({}),
      createBookDto({ description: rid(10) }),
      createBookDto({ tags: tags() }),
      createBookDto({
        description: rid(10),
        tags: tags()
      })
    ];

    for (const payload of params) {
      const response = await createBook(author.token, payload);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        ...payload,
        status: BookStatus.Private
      });
      expect(response.body).not.toHaveProperty('author');
    }
  });

  test.each(['root', 'admin', 'client'])(
    `%s cannot create book`,
    async user => {
      const response = await createBook(getGlobalUser(user).token);
      expect(response.status).toBe(HttpStatus.FORBIDDEN);
    }
  );

  test.each`
    property    | value
    ${'status'} | ${BookStatus.Public}
    ${'author'} | ${new ObjectId().toHexString()}
  `(
    '$property will not exist after the book created',
    async ({ property, value }: Record<string, string>) => {
      const dto = createBookDto({
        [property]: value
      });
      let response = await createBook(author.token, dto);

      expect(dto).toHaveProperty(property, value);
      expect(response.status).toBe(HttpStatus.CREATED);

      const book = response.body;
      response = await getBook(root.token, book.id);
      expect(response.body).not.toHaveProperty(property, value);
    }
  );
}
