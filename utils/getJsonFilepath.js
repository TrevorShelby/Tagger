module.exports = (jsonFilepathSegment) => {
	let jsonFilepath = path.resolve(process.cwd(), jsonFilepathSegment)
	if(path.extname(jsonFilepath) != '.json') jsonFilepath += '.json'
	return jsonFilepath
}