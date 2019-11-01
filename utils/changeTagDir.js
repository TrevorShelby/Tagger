const fs = require('fs')
const getJsonFilepath = require('./getJsonFilepath')
const handleIssue = require('./handleIssue')


module.exports = (tagDirFilename, makeChange, onWrite) => {
	const tagDirFilepath = getJsonFilepath(tagDirFilename)
	if(fs.existsSync(tagDirFilepath)) {
		//TODO: Add issue handling for if the file at tagDirFilepath isn't properly formatted.
		const tagDir = JSON.parse(fs.readFileSync(tagDirFilepath))
		makeChange(tagDir)
		fs.writeFileSync(tagDirFilepath, JSON.stringify(tagDir))
		onWrite(tagDir)
	}
	else
		handleIssue('error', '001', tagDirFilepath)
}