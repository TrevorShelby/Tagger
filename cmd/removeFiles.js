const path = require('path')
const changeTagDir = require('../utils/changeTagDir')


const removeFilesFromTagDir_ = filepaths => tagDir => {
	for(tag in tagDir) {
		filepaths.forEach( filepath => {
			if(tagDir[tag].includes(filepath))
				tagDir[tag].splice(tagDir[tag].indexOf(filepath), 1)
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