import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { S3 } from 'aws-sdk';
import sharp from 'sharp';

const s3 = new S3();

interface ResizeEvent {
  bucket: string;
  key: string;
  outputBucket: string;
  outputKey: string;
  width: number;
  height: number;
}


export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const resizeEvent: ResizeEvent = JSON.parse(event.body);

    const inputImage = await s3.getObject({ Bucket: resizeEvent.bucket, Key: resizeEvent.key }).promise();

    const resizedImage = await sharp(inputImage.Body)
      .resize(resizeEvent.width, resizeEvent.height)
      .toBuffer();

    await s3.putObject({
      Key: resizeEvent.outputKey,
      Body: resizedImage,
      Bucket: resizeEvent.outputBucket,
      ContentType: 'image/jpeg'
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Image resized and uploaded successfully' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
