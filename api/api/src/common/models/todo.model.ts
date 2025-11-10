import { ObjectType, Field, Int } from '@nestjs/graphql';
import { TodoStatus } from '../enums/todo-status.enum';
import { User } from './user.model';
import { Category } from './category.model';

@ObjectType()
export class Todo {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => TodoStatus)
  status: TodoStatus;

  @Field(() => Int)
  userId: number;

  @Field(() => User)
  user: User;

  @Field(() => Int, { nullable: true })
  categoryId?: number;

  @Field(() => Category, { nullable: true })
  category?: Category;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
