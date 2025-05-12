import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConfig } from 'src/config/cloudinary.config';
import * as toStream from 'buffer-to-stream';
import { extractPublicId } from 'cloudinary-build-url';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    const cloud = this.configService.get<CloudinaryConfig>('cloud');
    cloudinary.config({
      cloud_name: cloud?.cloudName,
      api_key: cloud?.apiKey,
      api_secret: cloud?.apiSecret,
    });
  }

  async uploadFile(file: Express.Multer.File, folder = ''): Promise<{ secure_url: string }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload failed with an error'));
        }
        resolve(result);
      });

      toStream(file.buffer).pipe(stream);
    });
  }

  async deleteFile(url: string): Promise<void> {
    const publicId = extractPublicId(url);
    await cloudinary.uploader.destroy(publicId);
  }

  private extractPublicId(url: string) {
    return extractPublicId(url);
  }
}
