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
  ParseUUIDPipe,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './track.interface';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  findAll(): Track[] {
    return this.tracksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Track {
    return this.tracksService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTrackDto: CreateTrackDto): Track {
    return this.tracksService.create(createTrackDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): Track {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid track ID format');
    }

    return this.tracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid track ID format');
    }

    this.tracksService.remove(id);
  }
}
