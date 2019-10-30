const path = require('path')
const changeTagDir = require('../utils/changeTagDir')


const removeFilesFromTagDir_ = filepaths => tagDir => {
	filepaths.forEach( filepath => {
		const filepathIndex = tagDir.files.indexOf(filepath)
		if(filepathIndex != -1)
			tagDir.files.splice(filepathIndex, 1)
		else
			console.log(`${filepath} is not listed in the directory's file list. All of its tags will still be removed, if it has any.`)
	})
	for(tag in tagDir.tags) {
		//TODO: Consider adding a warning if filepath doesn't appear anywhere in the tag directory.
		filepaths.forEach( filepath => {
			const filepathIndex = tagDir.tags[tag].indexOf(filepath)
			if(filepathIndex != -1)
				tagDir.tags[tag].splice(filepathIndex, 1)
		})
	}
}


module.exports = ({tagDirFilename='tag-dir.json', filenames}) => {
	const filepaths = filenames.map(filename => path.resolve(process.cwd(), filename))
	changeTagDir(
		tagDirFilename, removeFilesFromTagDir_(filepaths),
		() => console.log('Finished removing files.')
	)
}