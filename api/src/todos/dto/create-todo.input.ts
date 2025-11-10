import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { TodoStatus } from '../../common/enums/todo-status.enum';

@InputType()
export class CreateTodoInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => TodoStatus, { defaultValue: TodoStatus.PENDING })
  status?: TodoStatus;

  @Field(() => Int, { nullable: true })
  categoryId?: number;
}
