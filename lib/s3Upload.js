require('dotenv').config()
const fs = require('fs')
const AWS = require('aws-sdk')
// const mime = require('mime-types')

// AWS.config.update({ accessKeyId: 'AKIAUCQRQFQBLU5KWDHK',
//   secretAccessKey: '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',
//   region: 'us-east-1' })

const s3 = new AWS.S3()

const s3Upload = function (file, title) {
  const uploadParams = {
    Bucket: 'drag-on-drop',
    Key: title,
    Body: '',
    ACL: 'public-read',
    ContentType: file.mimetype
  }

  const fileStream = fs.createReadStream(file.path)

  fileStream.on('error', function (err) {
    console.log('File Error', err)
  })

  uploadParams.Body = fileStream

  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

module.exports = s3Upload
