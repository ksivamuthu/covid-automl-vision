import { NowRequest, NowResponse } from '@now/node'
import stream from 'stream';
import { Bucket, Storage } from '@google-cloud/storage';

function fromB64(str: string) {
    return Buffer.from(str, 'base64').toString();
}
const GCLOUD_CREDENTIALS = fromB64(process.env.GCLOUD_CREDENTIALS || '')
const storage = new Storage({ projectId: process.env.PROJECT_ID, credentials: JSON.parse(GCLOUD_CREDENTIALS) });
const bucketName = process.env.BUCKET_NAME || '';

export default (request: NowRequest, response: NowResponse) => {
    const { image, type } = request.body;
    let base64Image = image.split(';base64,').pop();

    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(base64Image, 'base64'));

    const bucket = new Bucket(storage, bucketName);
    const file = bucket.file(`${type}/${(new Date().getTime() / 1000 | 0)}.png`);
    const writeStream = file.createWriteStream({
        metadata: {
            contentType: 'image/png',
            metadata: {
                custom: 'metadata'
            }
        },
        public: false,
        validation: "md5"
    });
    bufferStream.pipe(writeStream)
        .on('error', (err) => {
            response.status(500).send(err).end();
        })
        .on('finish', () => {
            response.status(201).end();
        });
}