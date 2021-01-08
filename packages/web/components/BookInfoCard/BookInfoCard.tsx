import React, { useState } from 'react';
import { Card, ICardProps } from '@blueprintjs/core';
import { BookModel } from '@/components/BookModel';
import { Skelecton } from '@/components/Skelecton';
import { TagsProps } from '@/components/Tags';
import { BookTags } from './BookTags';
import { Schema$Book } from '@/typings';
import defaultClasses from './BookInfoCard.module.scss';

interface Props extends ICardProps, Pick<TagsProps, 'onTagClick'> {
  author?: boolean;
  book: Partial<Schema$Book>;
  bookModelSize?: number;
  classes?: typeof defaultClasses;
  flatten?: boolean;
}

export function BookInfoCard({
  classes: _classes,
  className = '',
  children,
  flatten = true,
  author = true,
  bookModelSize = 80,
  book,
  onTagClick,
  ...props
}: Props) {
  const [classes] = useState(() => ({ ...defaultClasses, ..._classes }));

  return (
    <Card {...props} className={`${classes['book']} ${className}`.trim()}>
      <BookModel
        width={bookModelSize}
        flatten={flatten}
        className={classes['book-model']}
        cover={book.cover}
      />

      <div className={classes['content']}>
        <div className={classes['header']}>
          <span className={classes['name']}>
            <Skelecton length={3}>{book.name}</Skelecton>
          </span>
          {author && (
            <span className={classes['author']}>
              <Skelecton length={2}>
                {book.authorName && `${book.authorName} 著`}
              </Skelecton>
            </span>
          )}
        </div>

        <BookTags book={book} onTagClick={onTagClick} />

        <div className={classes['description']}>
          <Skelecton length={60}>{book.description}</Skelecton>
        </div>
      </div>

      {children}
    </Card>
  );
}
