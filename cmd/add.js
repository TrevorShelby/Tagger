const fs = require('fs')
const path = require('path')
const getJsonFilepath = require('../utils/getJsonFilepath')


module.exports = ({tagDirFilename='tag-dir.json', tags, filenames}) => {
	const tagDirFilepath = getJsonFilepath(tagDirFilename)

	//TODO: Allow for the tagging of directories
	const filepaths = filenames.map(filename => path.resolve(process.cwd(),filename))
	if(fs.existsSync(tagDirFilepath)) {
		//TODO: Add code for if the file at tagDirFilepath isn't properly formatted.
		const tagDir = JSON.parse(fs.readFileSync(tagDirFilepath))
		tags.forEach( tag => {
			if(!(tag in tagDir)) tagDir[tag] = []
			tagDir[tag].push(...filepaths)
		})
		fs.writeFileSync(tagDirFilepath, JSON.stringify(tagDir))
		console.log('Finished tagging files.')
	}
	else
		console.log(`${tagDirFilepath} does not exist.`)
}