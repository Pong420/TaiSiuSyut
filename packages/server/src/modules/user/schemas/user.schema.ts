import { ObjectID } from 'mongodb';
import { Exclude, Transform } from 'class-transformer';
import { Prop, PropOptions, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InsertedUserSchema, UserRole, UserStatus } from '@/typings';
import { Group } from '@/utils/access';
import bcrypt from 'bcrypt';

function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}
class UserProps implements InsertedUserSchema {
  description?: string;
  wordCount?: number;
}

@Schema({
  discriminatorKey: 'role',
  timestamps: true,
  toJSON: {
    transform: (_model, raw) => new User(raw)
  }
})
export class User
  extends UserProps
  implements Required<Omit<InsertedUserSchema, keyof UserProps>> {
  _id: ObjectID;

  id: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({
    select: false,
    trim: true,
    type: String,
    set: hashPassword,
    get: (pwd: string) => pwd
  })
  @Exclude()
  password: string;

  @Prop({ type: String, required: true, unique: true, trim: true })
  email: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(UserRole)
  })
  role: UserRole;

  @Prop({
    type: Number,
    required: true,
    enum: Object.values(UserStatus)
  })
  @Group(['Root', 'Admin', 'Guest'])
  status: UserStatus;

  @Prop({
    type: String,
    unique: true, // for author
    default: function (this: PropOptions & User) {
      return this.username;
    }
  })
  nickname: string;

  @Transform(({ value }) => value && Number(value))
  createdAt: number;

  @Transform(({ value }) => value && Number(value))
  updatedAt: number;

  constructor(payload: Partial<User>) {
    super();
    Object.assign(this, payload);
  }

  // just for typings
  toJSON(): User {
    return new User(this);
  }
}

export const UserSchema = SchemaFactory.createForClass<User>(User);
