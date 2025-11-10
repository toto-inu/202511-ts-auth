import { InputType, Field, Int } from '@nestjs/graphql';
import { TodoStatus } from '../../common/enums/todo-status.enum';

@InputType()
export class UpdateTodoInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => TodoStatus, { nullable: true })
  status?: TodoStatus;

  @Field(() => Int, { nullable: true })
  categoryId?: number;
}
