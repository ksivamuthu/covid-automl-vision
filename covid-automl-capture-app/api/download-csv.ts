import { NowRequest, NowResponse } from '@now/node'
import { parse } from 'json2csv';
import { Bucket, Storage } from '@google-cloud/storage';

function fromB64(str: string) {
    return Buffer.from(str, 'base64').toString();
}
const GCLOUD_CREDENTIALS = fromB64(process.env.GCLOUD_CREDENTIALS || '')
const storage = new Storage({ projectId: process.env.PROJECT_ID, credentials: JSON.parse(GCLOUD_CREDENTIALS) });
const bucketName = process.env.BUCKET_NAME || '';

export default (request: NowRequest, response: NowResponse) => {
    const bucket = new Bucket(storage, bucketName);
    bucket.getFiles({ maxResults: 1000 }).then((res) => {
        const names = res[0].filter(x => x.name.endsWith('.png'))
            .map(x => {
                return { image_path: `gs://${bucketName}/${x.name}`, label: x.name.split('/')[0] }
            });
        const csvString = parse(names);
        response.setHeader('Content-disposition', 'attachment; filename=data.csv');
        response.setHeader('Content-Type', 'text/csv');
        response.status(200).send(csvString);
    });
}