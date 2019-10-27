const fs = require('fs')
const path = require('path')
const getInitFilepath = require('../utils/getInitFilepath')


//initFpSeg is the file path segment given by the user to be used for the init file.
module.exports = ({initFpSeg='./init.json'}) => {
	const initFp = getInitFilepath(initFpSeg)

	if(fs.existsSync(initFp))
		console.log(`${initFp} already exists.`)
	else {
		fs.write(initFp, JSON.stringify('{}'))
		console.log(`Initialized ${initFp}.`)
	}
}