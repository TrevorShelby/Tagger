const fs = require('fs')
const path = require('path')
const getJsonFilepath = require('../utils/getJsonFilepath')


module.exports = ({tagDirFilename='tag-dir.json', tags, filenames}) => {
	const tagDirFilepath = getJsonFilepath(tagDirFilename)

	//TODO: Allow for the untagging of directories
	const filepaths = filenames.map(filename => {
		const filepath = path.resolve(process.cwd(),filename)
		if(fs.existsSync(filepath)) return filepath
		else console.log(`${filepath} does not exist and will not be tagged.`)
	}).filter(filepath => filepath != null)

	if(fs.existsSync(tagDirFilepath)) {
		//TODO: Add code for if the file at tagDirFilepath isn't properly formatted.
		const tagDir = JSON.parse(fs.readFileSync(tagDirFilepath))
		tags.forEach( tag => {
			if(!(tag in tagDir)) {
				console.log(`${tag} is not a tag.`)
				return
			}
			filepaths.forEach(filepath => {
				if(tagDir[tag].includes(filepath))
					tagDir[tag].splice(tagDir[tag].indexOf(filepath), 1)
				else
					console.log(`${filepath} did not have the tag ${tag}`)
			})
		})
		fs.writeFileSync(tagDirFilepath, JSON.stringify(tagDir))
		console.log('Finished untagging files.')
	}
	else
		console.log(`${tagDirFilepath} does not exist.`)
}