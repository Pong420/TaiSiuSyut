import React from 'react';
import { Schema$Chapter } from '@/typings';
import { Classes, Tag } from '@blueprintjs/core';
import classes from './ClientBookDetails.module.scss';

interface Props {
  chapters: Partial<Schema$Chapter>[];
}

export function ClientBookDetailsChapters({ chapters }: Props) {
  const maxLength = String(chapters.slice(-1)[0].number || '').length;

  return (
    <div className={classes.chapters}>
      {chapters.map(chapter => (
        <div
          key={chapter.id}
          className={[Classes.MENU_ITEM, classes['chapter-item']].join(' ')}
        >
          <Tag minimal className={classes.tag}>
            {String(chapter.number).padStart(maxLength, '0')}
          </Tag>
          {chapter.name}
        </div>
      ))}
    </div>
  );
}
