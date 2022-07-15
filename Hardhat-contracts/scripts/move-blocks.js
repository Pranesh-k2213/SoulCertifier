const { moveBlocks } = require("../utils/move-blocks")

const BLOCKS = 4
const SLEEP_AMOUNT = 500

async function main() {
    await moveBlocks(BLOCKS, (sleepAmount = SLEEP_AMOUNT))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
