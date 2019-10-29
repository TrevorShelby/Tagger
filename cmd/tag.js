const fs = require('fs')
const path = require('path')
const changeTagDir = require('../utils/changeTagDir')


const tagFiles_ = (tags, filepaths) => tagDir => {
	tags.forEach( tag => {
		if(!(tag in tagDir)) tagDir[tag] = []
		filepaths.forEach( filepath => {
			if(tagDir[tag].includes(filepath))
				console.log(`${filepath} already had the tag ${tag}.`)
			else
				tagDir[tag].push(filepath)
		})
	})
}


module.exports = ({tagDirFilename='tag-dir.json', tags, filenames}) => {
	//TODO: Allow for the tagging of directories
	const filepaths = filenames.map(filename => {
		const filepath = path.resolve(process.cwd(),filename)
		if(fs.existsSync(filepath)) return filepath
		else console.log(`${filepath} does not exist and will not be tagged.`)
	}).filter(filepath => filepath != null)

	changeTagDir(
		tagDirFilename, tagFiles_(tags, filepaths), () => console.log('Finished tagging files.')
	)
}