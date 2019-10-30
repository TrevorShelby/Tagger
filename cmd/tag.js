const fs = require('fs')
const path = require('path')
const changeTagDir = require('../utils/changeTagDir')
const TagDirectory = require('../utils/tagDirectory')
const printResults = require('../utils/printResults')


const tagFiles_ = (tags, filepaths) => tagDir => {
	const results = new TagDirectory(tagDir).tagFiles(filepaths, tags)
	printResults(results, {alreadyTaggedFiles: ({file, tag}) => `${file} already had the tag ${tag}`})
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