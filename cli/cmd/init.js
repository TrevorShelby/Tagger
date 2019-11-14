const fs = require('fs')
const getJsonFilepath = require('../tagDirIo').getJsonFilepath


//Creates a new tag-based directory in the local file system..
module.exports = ({tagDirFilename='tag-dir.json'}={}) => {
	const tagDirFilepath = getJsonFilepath(tagDirFilename)

	if(fs.existsSync(tagDirFilepath))
		console.error(`${tagDirFilepath} already exists.`)
	else {
		fs.writeFileSync(tagDirFilepath, JSON.stringify( {files:{}, tags: {}} ))
		console.log(`Successfully initialized tag directory at ${tagDirFilepath}.`)
	}
}