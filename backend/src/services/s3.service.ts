import { GetObjectCommand, PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

export class S3Service {



  constructor( protected client: S3Client ) { }

  public async put(bucket: string, key: string, data: unknown): Promise<PutObjectCommandOutput> {

    try {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: data as string,
      });

      return await this.client.send(command);
    } catch (error) {
        console.log(error)
        if (error instanceof Error) {
            console.error('put', { key, message: error?.message });
        }
      throw error;
    }
  }

  public async get(bucket: string, key: string): Promise<string> {

    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });
    const streamToString = async (stream: Readable | undefined): Promise<string> => {
        if (!stream) {
            return '';
        }
        return await new Promise((resolve, reject) => {
            const chunks: Uint8Array[] = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        });
        }       

      const response =  await this.client.send(command);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseContents = await streamToString(response.Body as Readable);
      return responseContents;
    } catch (error) {
      console.log(error)
      if (error instanceof Error) {
          console.log('Get', { key, message: error?.message });
      }
      throw error;
    }
  }
}