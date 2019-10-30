const path = require('path')
const changeTagDir = require('../utils/changeTagDir')
const TagDirectory = require('../utils/tagDirectory')
const printResults = require('../utils/printResults')


const removeFilesFromTagDir_ = filepaths => tagDir => {
	const results = new TagDirectory(tagDir).removeFiles(filepaths)
	printResults(results, {missingFiles: missingFile => `${missingFile} des not exist in this directory`})
}


module.exports = ({tagDirFilename='tag-dir.json', filenames}) => {
	const filepaths = filenames.map(filename => path.resolve(process.cwd(), filename))
	changeTagDir(
		tagDirFilename, removeFilesFromTagDir_(filepaths),
		() => console.log('Finished removing files.')
	)
}