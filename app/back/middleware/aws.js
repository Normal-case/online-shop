const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const path = require('path')

AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const s3 = new AWS.S3()

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp']

const imageUploader = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'onlineshopimage',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, callback) => {
            const uploadDirectory = 'test'
            const extension = path.extname(file.originalname)
            if(!allowedExtensions.includes(extension)) {
                return callback(new Error('wrong extension'))
            }
            callback(null, `${uploadDirectory}/${Date.now()}_${file.originalname}`)
        },
        acl: 'public-read'
    })
})

module.exports = {
    imageUploader
} 