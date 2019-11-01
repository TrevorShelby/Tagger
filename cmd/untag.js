const fs = require('fs')
const path = require('path')
const changeTagDir = require('../utils/changeTagDir')
const TagDirectory = require('../utils/tagDirectory')
const handleIssue = require('../utils/handleIssue')


const untagFiles_ = (tags,filepaths) => tagDir => new TagDirectory(tagDir).untagFiles(filepaths,tags)

module.exports = ({tagDirFilename='tag-dir.json', tags, filenames}) => {
	//TODO: Allow for the untagging of directories
	const filepaths = filenames.map( filename => path.resolve(process.cwd(),filename) )

	changeTagDir(tagDirFilename, untagFiles_(tags, filepaths), () => handleIssue('success', '104'))
}