import { BidStateManager } from "@/bidStateManager"

import { expect } from "chai"

describe("BidStateManager", function () {
	let bidStateManager: BidStateManager

	before(() => {
		bidStateManager = new BidStateManager()
	})

	describe("Creating Shuffled Deck Of Cards", () => {
		const result = bidStateManager.createDeck(30)

		const expected = Array.from({ length: 30 }, (_, index) => index + 1)

		expect(result).to.have.members(expected)
	})

	// describe("#indexOf()", function () {
	// 	it("should return -1 when the value is not present", function () {
	// 		assert.equal([1, 2, 3].indexOf(4), -1)
	// 	})
	// })
})
