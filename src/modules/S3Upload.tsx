import AWS from 'aws-sdk';
import uuid from 'react-uuid'

const bucket = process.env.NEXT_PUBLIC_S3_BUCKET;
const region = process.env.NEXT_PUBLIC_AWS_CONFIG_REGION
const identityPoolId = process.env.NEXT_PUBLIC_AWS_CONFIG_IDENTITY_POOL_ID || ''

AWS.config.update({
  region : region,
  credentials : new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId
  })
})

const s3 = new AWS.S3({
  apiVersion: "2006-03-01"
});

class S3Upload {

  getS3 = () => {
    return s3;
  }

  getVideUploadParam = (file: File, userId: string) => {
    if (file == null) return;
  
    const folderName = "temp/" + userId + "/"
    const key = folderName + uuid() + ".mp4";

    const params = {
        Bucket: bucket!!,
        Key: key, 
        Body: file,
        ACL: 'public-read',
        ContentType: "video/mp4"
    }

    return params
  }
}

export default new S3Upload()
