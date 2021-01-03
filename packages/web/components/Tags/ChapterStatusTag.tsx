import React from 'react';
import { ITagProps, Tag } from '@blueprintjs/core';
import { ChapterStatus } from '@/typings';

interface Props {
  status?: ChapterStatus;
}

function getTagPropsByChapterStatus(status: ChapterStatus): ITagProps {
  switch (status) {
    case ChapterStatus.Public:
      return { intent: 'success' };
    default:
      return { minimal: true };
  }
}

export function ChapterStatusTag({ status }: Props) {
  if (!status) {
    return null;
  }
  return (
    <Tag {...getTagPropsByChapterStatus(status)}>{ChapterStatus[status]}</Tag>
  );
}
