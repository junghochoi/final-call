import { Player, Stage, PlayerInitializationPayload, BidStateSerialized } from "./common"

export type GameStateUpdatePayload = {
	roomId: string
	players: Player[]
	stage: Stage
	bidState: BidStateSerialized
}

export type IndividualGameStateUpdatePayload = IndividualBidStateUploadPayload | IndividualAuctionStateUploadPayload

export type IndividualBidStateUploadPayload = {
	stage: Stage.Bidding
	propertyCards: number[]
	bank: number
}

export type IndividualAuctionStateUploadPayload = {
	stage: Stage.Auctioning
}

export interface ServerToClientEvents {
	PlayerJoin: (payload: Player) => void
	PlayerLeave: (payload: Player) => void
	GameStateUpdate: (payload: GameStateUpdatePayload) => void
	IndividualGameStateUpdate: (payload: IndividualGameStateUpdatePayload) => void
	PlayerInitialization: (payload: PlayerInitializationPayload) => void
}
