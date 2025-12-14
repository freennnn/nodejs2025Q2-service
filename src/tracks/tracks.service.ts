import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Track } from '../../generated/prisma';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Track[]> {
    return this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }

    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    return this.prisma.track.create({
      data: {
        name: createTrackDto.name,
        artistId: createTrackDto.artistId ?? null, // Convert undefined to null
        albumId: createTrackDto.albumId ?? null, // Convert undefined to null
        duration: createTrackDto.duration,
      },
    });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    try {
      return await this.prisma.track.update({
        where: { id },
        data: {
          ...updateTrackDto,
          // Handle nullable foreign key type conversions
          ...(updateTrackDto.artistId !== undefined && {
            artistId: updateTrackDto.artistId ?? null,
          }),
          ...(updateTrackDto.albumId !== undefined && {
            albumId: updateTrackDto.albumId ?? null,
          }),
        },
      });
    } catch (error) {
      // Prisma throws P2025 when record is not found
      if (error.code === 'P2025') {
        throw new NotFoundException(`Track with id ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.track.delete({
        where: { id },
      });
      // No manual cascade deletion needed - Prisma handles it automatically:
      // - FavoriteTrack records: CASCADE deleted
    } catch (error) {
      // Prisma throws P2025 when record is not found
      if (error.code === 'P2025') {
        throw new NotFoundException(`Track with id ${id} not found`);
      }
      throw error;
    }
  }

  // removeArtistReferences and removeAlbumReferences methods removed
  // Prisma handles this automatically with onDelete: SetNull
}
