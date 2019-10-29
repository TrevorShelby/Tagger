const fs = require('fs')
const path = require('path')
const getJsonFilepath = require('../utils/getJsonFilepath')


module.exports = ({tagDirFpSeg='./tag-dir.json', tags, filenames}) => {
	const tagDirFp = getJsonFilepath(tagDirFpSeg)

	//TODO: Allow for the tagging of directories
	const filepaths = filenames.map(filename => path.resolve(process.cwd(),filename))
	if(fs.existsSync(tagDirFp)) {
		//TODO: Add code for if the file at tagDirFp isn't properly formatted.
		const tagDir = JSON.parse(fs.readFileSync(tagDirFp))
		tags.forEach( tag => {
			if(!(tag in tagDir)) tagDir[tag] = []
			tagDir[tag].push(...filepaths)
		})
		fs.writeFileSync(tagDirFp, JSON.stringify(tagDir))
		console.log('Finished tagging files.')
	}
	else
		console.log(`${tagDirFp} does not exist.`)
}