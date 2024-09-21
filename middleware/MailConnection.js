import AWS from 'aws-sdk';
import {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_KEY,
    AWS_REGION,
    AWS_ACCESS_KEY_SES,
    AWS_SECRET_KEY_SES
} from "../config.js"
AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION
});


const SES_CONFIG = {
    accessKeyId: AWS_ACCESS_KEY_SES,
    secretAccessKey: AWS_SECRET_KEY_SES,
    region: AWS_REGION,
    apiVersion: '2010-12-01'
};

const ses = new AWS.SES(SES_CONFIG);

export {
    ses,
    AWS
}