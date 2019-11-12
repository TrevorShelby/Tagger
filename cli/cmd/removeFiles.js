const path = require('path')
const changeTagDir = require('../utils/changeTagDir')
const TagDirectory = require('../utils/tagDirectory')
const handleIssue = require('../utils/handleIssue')


const removeFiles_ = filepaths => tagDir => new TagDirectory(tagDir).removeFiles(filepaths)

module.exports = ({tagDirFilename='tag-dir.json', filenames}) => {
	const filepaths = filenames.map(filename => path.resolve(process.cwd(), filename))
	changeTagDir(tagDirFilename, removeFiles_(filepaths), () => handleIssue('success', '101'))
}