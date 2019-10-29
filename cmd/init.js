const fs = require('fs')
const getJsonFilepath = require('../utils/getJsonFilepath')


module.exports = ({tagDirFilename='tag-dir.json'}={}) => {
	const tagDirFilepath = getJsonFilepath(tagDirFilename)

	if(fs.existsSync(tagDirFilepath))
		console.log(`${tagDirFilepath} already exists.`)
	else {
		fs.writeFileSync(tagDirFilepath, JSON.stringify({}))
		console.log(`Initialized ${tagDirFilepath}.`)
	}
}