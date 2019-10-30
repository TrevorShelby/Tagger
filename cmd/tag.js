const fs = require('fs')
const path = require('path')
const changeTagDir = require('../utils/changeTagDir')


const tagFiles_ = (tags, filepaths) => tagDir => {
	//adds filepath to the directory if it doesn't already exist
	filepaths.forEach( filepath => {
		if(!tagDir.files.includes(filepath))
			tagDir.files.push(filepath)
	})

	//in the directory, adds each tag to each file
	tags.forEach( tag => {
		if(!(tag in tagDir.tags)) tagDir.tags[tag] = []
		filepaths.forEach( filepath => {
			if(tagDir.tags[tag].includes(filepath))
				console.log(`${filepath} already had the tag ${tag}.`)
			else
				tagDir.tags[tag].push(filepath)
		})
	})
}


module.exports = ({tagDirFilename='tag-dir.json', tags, filenames}) => {
	//TODO: Allow for the tagging of directories
	//removes all filepaths that doesn't point to a file.
	const filepaths = filenames.map(filename => {
		const filepath = path.resolve(process.cwd(),filename)
		if(fs.existsSync(filepath)) return filepath
		else console.log(`${filepath} does not exist and will not be tagged.`)
	}).filter(filepath => filepath != null)

	changeTagDir(
		tagDirFilename, tagFiles_(tags, filepaths), () => console.log('Finished tagging files.')
	)
}