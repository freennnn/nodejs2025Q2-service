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
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) =>
      plainToClass(UserResponseDto, user, { excludeExtraneousValues: false }),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.usersService.findOne(id);
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: false,
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: false,
    });
  }

  @Put(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.usersService.updatePassword(id, updatePasswordDto);
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: false,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    await this.usersService.remove(id);
  }
}
