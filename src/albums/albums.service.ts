import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Album } from '../../generated/prisma';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    return album;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    return this.prisma.album.create({
      data: {
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId ?? null,
      },
    });
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    try {
      return await this.prisma.album.update({
        where: { id },
        data: {
          ...updateAlbumDto,
          // Handle nullable foreign key type conversion
          ...(updateAlbumDto.artistId !== undefined && {
            artistId: updateAlbumDto.artistId ?? null,
          }),
        },
      });
    } catch (error) {
      // Prisma throws P2025 when record is not found
      if (error.code === 'P2025') {
        throw new NotFoundException(`Album with id ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.album.delete({
        where: { id },
      });
      // No manual cascade deletion needed - Prisma handles it automatically:
      // - FavoriteAlbum records: CASCADE deleted
      // - Tracks: albumId set to NULL
    } catch (error) {
      // Prisma throws P2025 when record is not found
      if (error.code === 'P2025') {
        throw new NotFoundException(`Album with id ${id} not found`);
      }
      throw error;
    }
  }

  // removeArtistReferences method removed - Prisma handles this with onDelete: SetNull
}
