const path = require('path')
const { readTagDirectory, writeTagDirectory } = require('../utils/tagDirIo')



const getJsonFilepath = filename => {
	let jsonFilepath = path.resolve(process.cwd(), filename)
	if(path.extname(jsonFilepath) != '.json') jsonFilepath += '.json'
	return jsonFilepath
}


const cliReadTagDirectory = tagDirFilename => {
	const tagDirFilepath = getJsonFilepath(tagDirFilename)
	return readTagDirectory(tagDirFilepath)
}

const cliWriteTagDirectory = (tagDirFilename, tagDir) => {
	const tagDirFilepath = getJsonFilepath(tagDirFilename)
	writeTagDirectory(tagDirFilepath, tagDir)
}



module.exports = {
	readTagDirectory: cliReadTagDirectory,
	writeTagDirectory: cliWriteTagDirectory,
	getJsonFilepath
}