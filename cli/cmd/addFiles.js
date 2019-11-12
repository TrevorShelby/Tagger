const path = require('path')
const getJsonFilepath = require('../../utils/getJsonFilepath')
const { readTagDirectory, writeTagDirectory } = require('../../utils/tagDirIo')
const notify = require('../tagDirNotifications')


module.exports = ({tagDirFilename='tag-dir.json', filenames}) => {
	const tagDirFilepath = getJsonFilepath(tagDirFilename)
	const tagDir = readTagDirectory(tagDirFilepath)
	const filepaths = filenames.map(filename => path.resolve(process.cwd(), filename))
	tagDir.addFiles(filepaths, notify)
	writeTagDirectory(tagDirFilepath, tagDir)
}