const fs = require('fs')
const path = require('path')
const { readTagDirectory, writeTagDirectory } = require('../tagDirIo')
const notify = require('../tagDirNotifications')


module.exports = ({tagDirFilename='tag-dir.json', filenames}) => {
	const tagDir = readTagDirectory(tagDirFilename)
	//Gets the filepaths from the filenames and splits them into two categories: existent and
	//nonexistent, depending on whether or not the file exists in the local directory.
	const filepaths = filenames
		.map(filename => path.resolve(process.cwd(), filename))
		.reduce((filepaths, filepath) => {
			if(fs.existsSync(filepath))
				filepaths.existent.push(filepath)
			else
				filepaths.nonexistent.push(filepath)
			return filepaths
		}, {existent: [], nonexistent: []})
	//logs all of the nonexistent files.
	filepaths.nonexistent
		.forEach( filepath => console.log(`${filepath} does not exist and won't be added to this directory.`) )
	tagDir.addFiles(filepaths.existent, notify)
	writeTagDirectory(tagDirFilename, tagDir)
}