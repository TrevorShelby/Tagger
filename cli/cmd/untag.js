const path = require('path')
const { readTagDirectory, writeTagDirectory } = require('../tagDirIo')
const notify = require('../tagDirNotifications')



module.exports = ({tagDirFilename='tag-dir.json', filenames, tags}) => {
	//TODO: Allow for the untagging of directories
	const filepaths = filenames.map( filename => path.resolve(process.cwd(),filename) )

	const tagDir = readTagDirectory(tagDirFilename)
	tagDir.untagFiles(filepaths, tags, notify)
	writeTagDirectory(tagDirFilename, tagDir)
}