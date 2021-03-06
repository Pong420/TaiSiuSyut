import {
  Param$CreateBook,
  Param$GetBooks,
  Param$UpdateBook,
  Schema$Book,
  PaginateResult
} from '@/typings';
import { api } from './api';
import { routes } from './routes';
import { handleCloudinaryUpload } from './cloudinary';

export const createBook = async (payload: Param$CreateBook) => {
  if (payload.cover && typeof payload.cover !== 'string') {
    payload.cover = await handleCloudinaryUpload(payload.cover).toPromise();
  }
  return api.post<Schema$Book>(routes.create_book, payload);
};

export const updateBook = async ({ id, ...payload }: Param$UpdateBook) => {
  if (payload.cover && typeof payload.cover !== 'string') {
    payload.cover = await handleCloudinaryUpload(payload.cover).toPromise();
  }
  return api.patch<Schema$Book>(
    routes.update_book.generatePath({ id }),
    payload
  );
};

export const getBooks = (params?: Param$GetBooks) =>
  api.get<PaginateResult<Schema$Book>>(routes.get_books, { params });

export const getBook = ({ id }: { id: string }) =>
  api.get<Schema$Book>(routes.get_book.generatePath({ id }));

export const getBookByName = ({ bookName }: { bookName: string }) =>
  api.get<Schema$Book>(
    routes.get_book_by_name.generatePath({ name: bookName })
  );

export const publishBook = ({ id }: { id: string }) =>
  api.post<Schema$Book>(
    routes.publish_finish_book.generatePath({ id, type: 'publish' })
  );

export const finishBook = ({ id }: { id: string }) =>
  api.post<Schema$Book>(
    routes.publish_finish_book.generatePath({ id, type: 'finish' })
  );

export const deleteBook = ({ id }: { id: string }) =>
  api.delete<void>(routes.delete_book.generatePath({ id }));
