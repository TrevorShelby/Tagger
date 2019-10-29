const fs = require('fs')
const path = require('path')
const changeTagDir = require('../utils/changeTagDir')


module.exports = ({tagDirFilename='tag-dir.json', tags, filenames}) => {
	//TODO: Allow for the untagging of directories
	const filepaths = filenames.map(filename => {
		const filepath = path.resolve(process.cwd(),filename)
		if(fs.existsSync(filepath)) return filepath
		else console.log(`${filepath} does not exist and will not be tagged.`)
	}).filter(filepath => filepath != null)

	changeTagDir(
		tagDirFilename,
		tagDir => {
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
		},
		() => console.log('Finished untagging files.')
	)
}