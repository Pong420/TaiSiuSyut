import React from 'react';
import { GetStaticProps } from 'next';
import { ClientLayout } from '@/components/client/ClientLayout';
import { ClientHome, ClientHomeProps } from '@/components/client/ClientHome';
import { Meta } from '@/components/Meta';
import { getBookService, serialize } from '@/service/server';
import { Schema$Book, Order, BookStatus } from '@/typings';

interface Props extends Pick<ClientHomeProps, 'data'> {}

async function getClientHomePageData(): Promise<ClientHomeProps['data']> {
  const bookService = await getBookService();
  const limit = 6;
  const response = await Promise.all([
    bookService.random(limit),
    bookService.random(limit),
    bookService.random(limit),
    bookService.findAll({ status: BookStatus.Finished }, null, {
      sort: { updatedAt: Order.DESC },
      limit
    })
  ]);

  const [mostvisited, clientSuggested, adminSuggested, finished] = response.map(
    books => {
      return books.map(doc => serialize<Schema$Book>(doc));
    }
  );

  return {
    mostvisited,
    adminSuggested,
    clientSuggested,
    finished
  };
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const data = await getClientHomePageData();
  return {
    revalidate: 60 * 60,
    props: {
      data
    }
  };
};

export default function HomePage({ data }: Props) {
  return (
    <>
      <Meta />
      <ClientHome data={data} />
    </>
  );
}

HomePage.layout = ClientLayout;
