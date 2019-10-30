const fs = require('fs')
const getJsonFilepath = require('./getJsonFilepath')


module.exports = (tagDirFilename, makeChange, onWrite) => {
	const tagDirFilepath = getJsonFilepath(tagDirFilename)
	if(fs.existsSync(tagDirFilepath)) {
		//TODO: Add code for if the file at tagDirFilepath isn't properly formatted.
		const tagDir = JSON.parse(fs.readFileSync(tagDirFilepath))
		makeChange(tagDir)
		fs.writeFileSync(tagDirFilepath, JSON.stringify(tagDir))
		onWrite(tagDir)
	}
	else {
		console.error(`${tagDirFilepath} does not exist.`)
		process.exit(1)
	}
}