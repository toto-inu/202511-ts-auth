import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  create(createTodoInput: CreateTodoInput, userId: number) {
    return this.prisma.todo.create({
      data: {
        ...createTodoInput,
        userId,
      },
      include: {
        user: true,
        category: true,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.todo.findMany({
      where: { userId },
      include: {
        user: true,
        category: true,
      },
    });
  }

  async findOne(id: number, userId: number) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
      include: {
        user: true,
        category: true,
      },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException('You can only access your own todos');
    }

    return todo;
  }

  async update(updateTodoInput: UpdateTodoInput, userId: number) {
    const { id, ...data } = updateTodoInput;

    const todo = await this.prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException('You can only update your own todos');
    }

    return this.prisma.todo.update({
      where: { id },
      data,
      include: {
        user: true,
        category: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    const todo = await this.prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (todo.userId !== userId) {
      throw new ForbiddenException('You can only delete your own todos');
    }

    return this.prisma.todo.delete({
      where: { id },
      include: {
        user: true,
        category: true,
      },
    });
  }
}
