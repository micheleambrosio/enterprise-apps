import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Body,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
  Header,
  Param,
  Res,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import path, { extname } from 'path';
import fs from 'fs';
import type { Request, Response } from 'express';
import { ContentManagementService } from '@src/core/service/content-management.service';
import { MediaPlayerService } from '@src/core/service/media-player.service';

@Controller('content')
export class ContentController {
  constructor(
    private readonly contentManagementService: ContentManagementService,
    private readonly mediaPlayerService: MediaPlayerService,
  ) {}

  @Post('video')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ],
      {
        dest: './uploads',
        storage: diskStorage({
          destination: './uploads',
          filename: (_req, file, callback) =>
            callback(
              null,
              `${Date.now()}-${randomUUID()}${extname(file.originalname)}`,
            ),
        }),
        fileFilter: (_req, file, callback) => {
          if (!['video/mp4', 'image/jpeg'].includes(file.mimetype)) {
            return callback(
              new BadRequestException(
                'Invalid file type. Only video/mp4 and image/jpeg are supported.',
              ),
              false,
            );
          }

          return callback(null, true);
        },
      },
    ),
  )
  async uploadVideo(
    @Req() _req: Request,
    @Body()
    contentData: {
      title: string;
      description: string;
    },
    @UploadedFiles()
    files: {
      video?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
    },
  ) {
    const videoFile = files.video?.[0];
    const thumbnailFile = files.thumbnail?.[0];

    if (!videoFile || !thumbnailFile) {
      throw new BadRequestException(
        'Both video and thumbnail files are required.',
      );
    }

    return await this.contentManagementService.createContent({
      title: contentData.title,
      description: contentData.description,
      url: videoFile.path,
      thumbnailUrl: thumbnailFile.path,
      sizeInKb: videoFile.size,
    });
  }

  @Get('stream/:videoId')
  @Header('ContentType', 'video/mp4')
  async streamVideo(
    @Param('videoId') videoId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const url = await this.mediaPlayerService.prepareStreaming(videoId);

    if (!url) {
      return res.sendStatus(HttpStatus.NOT_FOUND);
    }

    const videoPath = path.join('.', url);
    const fileSize = fs.statSync(videoPath).size;

    const range = req.headers.range;

    if (!range) {
      res.writeHead(HttpStatus.OK, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });

      return fs.createReadStream(videoPath).pipe(res);
    }

    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    res.writeHead(HttpStatus.PARTIAL_CONTENT, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    });

    return file.pipe(res);
  }
}
