const fs = require('fs')
const getJsonFilepath = require('../utils/getJsonFilepath')


//tagDirFpSeg is the file path segment given by the user to be used for the init file.
module.exports = ({tagDirFpSeg='./tag-dir.json'}={}) => {
	const tagDirFp = getJsonFilepath(tagDirFpSeg)

	if(fs.existsSync(tagDirFp))
		console.log(`${tagDirFp} already exists.`)
	else {
		fs.writeFileSync(tagDirFp, JSON.stringify({}))
		console.log(`Initialized ${tagDirFp}.`)
	}
}