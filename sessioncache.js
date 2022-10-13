
const RangeList = require("./utils/utils").RangeList
const availableGameIDs = RangeList(1, 10) //10 concurrent games allowed ATM 
const idGameMap = new Map()
const userIdJWTMap = new Map()
const userSet = new Set()


module.exports = {idGameMap, userSet, availableGameIDs, userIdJWTMap}