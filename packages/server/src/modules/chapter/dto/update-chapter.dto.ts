import { Exclude, Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import {
  ChapterStatus,
  ChapterType,
  Param$UpdateChapter,
  Schema$Chapter
} from '@/typings';
import { Group } from '@/utils/access';
import {
  IsChapterPrefix,
  IsChapterName,
  IsChapterStatus,
  IsChapterType,
  IsContent,
  IsPrice
} from './';

class Excluded implements Partial<Schema$Chapter> {
  @Exclude()
  id?: undefined;

  @Exclude()
  number?: undefined;

  @Exclude()
  author: undefined;

  @Exclude()
  book: undefined;

  @Exclude()
  bookID: undefined;

  @Exclude()
  chapterID: undefined;

  @Exclude()
  createdAt?: undefined;

  @Exclude()
  updatedAt?: undefined;

  @Exclude()
  wordCount?: number;
}

class UpdateChapter
  extends Excluded
  implements
    Partial<Omit<Param$UpdateChapter, keyof Excluded>>,
    Partial<Omit<Schema$Chapter, keyof Excluded>> {
  @IsChapterPrefix()
  prefix?: string;

  @IsOptional()
  @IsChapterName()
  name?: string;

  @IsOptional()
  @IsContent()
  content?: string;

  @IsOptional()
  @IsChapterStatus()
  @Group(['chapter_status_update'])
  status?: ChapterStatus;

  @IsOptional()
  @IsChapterType()
  type?: ChapterType;

  @IsPrice()
  price?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value && JSON.parse(value))
  hasNext?: boolean;
}

export class UpdateChapterDto
  extends UpdateChapter
  implements
    Required<Omit<Param$UpdateChapter, keyof UpdateChapter>>,
    Required<Omit<Schema$Chapter, keyof UpdateChapter>> {}
