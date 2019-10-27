module.exports = (initFilepathSegment) => {
	let initFilepath = path.resolve(process.cwd(), initFilepathSegment)
	if(path.extname(initFilepath) != '.json') initFilepath += '.json'
	return initFilepath
}