const fs = require('fs')
const path = require('path')


const getInitFilepath = (initFilepathSegment) => {
	let initFilepath = path.resolve(process.cwd(), initFilepathSegment)
	if(path.extname(initFilepath) != '.json') initFilepath += '.json'
	return initFilepath
}


//initFpSeg is the file path segment given by the user to be used for the init file.
module.exports = (initFpSeg='./init.json') => {
	const initFp = getInitFp(initFpSeg)

	if(fs.existsSync(initFp))
		console.log(`${initFp} already exists.`)
	else {
		fs.write(initFp, JSON.stringify('{}'))
		console.log(`Initialized ${initFp}.`)
	}
}