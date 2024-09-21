import AWS from "aws-sdk";
import { AWS_ACCESS_KEY_ID, AWS_SECRET_KEY, AWS_REGION } from "../config.js";

AWS.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_KEY,
});

const s3 = new AWS.S3();

export const uploadinS3 = async (filename, letterPdf, mimeType=null, callback) => {
  // Specify your S3 bucket and object key
  const bucketName = "abbostop";
  const objectKey = filename;//`pdf/${filename}.pdf`; // Object key in S3
  if(typeof letterPdf == 'string'){
    letterPdf = Buffer.from(letterPdf, "base64");
  }

  // Define the S3 upload parameters
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Body: letterPdf //Buffer.from(letterPdf, "base64"), // Decode base64 data
  };
  
  if(mimeType){
    params.ContentType = mimeType;
  }


  // Upload the file to S3
  try {
    s3.upload(params, (error, data) => {
      if (error) {
        return callback(error, null);
      }

      return callback(null, data);
    });
  } catch (err) {
    return callback(err, null);
  }
};

export const uploadinS3Promise = async(filename, letterPdf, mimeType = null) => {

    return new Promise((resolve, reject) => {

        // Specify your S3 bucket and object key
        const bucketName = "abbostop";
        const objectKey = filename; //`pdf/${filename}.pdf`; // Object key in S3
        if (typeof letterPdf == 'string') {
            letterPdf = Buffer.from(letterPdf, "base64");
        }

        // Define the S3 upload parameters
        const params = {
            Bucket: bucketName,
            Key: objectKey,
            Body: letterPdf //Buffer.from(letterPdf, "base64"), // Decode base64 data
        };

        if (mimeType) {
            params.ContentType = mimeType;
        }
        
        // Upload the file to S3
        try {
            s3.upload(params, (error, data) => {
                if (error) {
                    return reject(error)
                }

                return resolve(data);
            });
        } catch (err) {
            return reject(err);
        }
    });
}
