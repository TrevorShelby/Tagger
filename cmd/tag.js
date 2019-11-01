const fs = require('fs')
const path = require('path')
const changeTagDir = require('../utils/changeTagDir')
const TagDirectory = require('../utils/tagDirectory')
const handleIssue = require('../utils/handleIssue')


const tagFiles_ = (tags, filepaths) => tagDir => new TagDirectory(tagDir).tagFiles(filepaths, tags)

module.exports = ({tagDirFilename='tag-dir.json', tags, filenames}) => {
	//TODO: Allow for the tagging of directories
	//removes all filepaths that doesn't point to a file.
	const filepaths = filenames.map(filename => {
		const filepath = path.resolve(process.cwd(),filename)
		if(fs.existsSync(filepath)) return filepath
		else handleIssue('warning', '016', filepath)
	}).filter(filepath => filepath != null)

	changeTagDir(tagDirFilename, tagFiles_(tags, filepaths), () => handleIssue('success', '103'))
}