const fs = require('fs')
const getJsonFilepath = require('../utils/getJsonFilepath')
const handleIssue = require('../utils/handleIssue')


module.exports = ({tagDirFilename='tag-dir.json'}={}) => {
	const tagDirFilepath = getJsonFilepath(tagDirFilename)

	if(fs.existsSync(tagDirFilepath))
		handleIssue('error', '000', tagDirFilepath)
	else {
		fs.writeFileSync(tagDirFilepath, JSON.stringify( {files:{}, tags: {}} ))
		handleIssue('success', '100', tagDirFilepath)
	}
}