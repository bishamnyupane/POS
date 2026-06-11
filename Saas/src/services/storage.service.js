const {Imagaekit} = require('imagekit');

const ImagekitClient = new Imagekit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})


async function uploadFile(file) {

    const result = await ImagekitClient.files.upload({
        file,
        fileName: "saas-file"+ Date.now(),
        folder: "/saas/files"
    })

    return result;
}


module.exports = { uploadFile };