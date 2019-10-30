const fs = require('fs')
const getJsonFilepath = require('../utils/getJsonFilepath')


module.exports = ({tagDirFilename='tag-dir.json'}={}) => {
	const tagDirFilepath = getJsonFilepath(tagDirFilename)

	if(fs.existsSync(tagDirFilepath)) {
		console.error(`${tagDirFilepath} already exists.`)
		process.exit(1)
	}
	else {
		fs.writeFileSync(tagDirFilepath, JSON.stringify( {files:{}, tags: {}} ))
		console.log(`Initialized ${tagDirFilepath}.`)
	}
}