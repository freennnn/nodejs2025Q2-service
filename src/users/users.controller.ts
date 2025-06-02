import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { plainToClass } from 'class-transformer';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): UserResponseDto[] {
    const users = this.usersService.findAll();
    return users.map((user) =>
      plainToClass(UserResponseDto, user, { excludeExtraneousValues: false }),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): UserResponseDto {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = this.usersService.findOne(id);
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: false,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): UserResponseDto {
    const user = this.usersService.create(createUserDto);
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: false,
    });
  }

  @Put(':id')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): UserResponseDto {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = this.usersService.updatePassword(id, updatePasswordDto);
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: false,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    this.usersService.remove(id);
  }
}
