import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  artistId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  albumId?: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
