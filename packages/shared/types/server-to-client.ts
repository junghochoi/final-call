import {
	Player,
	Stage,
	PlayerInitializationPayload,
	BidStateSerialized,
	AuctionStateSerialized,
	PlayerResultState,
	ResultStateSerialized,
	Sound,
	Card,
} from "./common"

export type GameStateUpdatePayload = {
	roomId: string
	players: Player[]
	playerOrder: Player[]
	stage: Stage
	bidState: BidStateSerialized
	auctionState: AuctionStateSerialized
	resultState: ResultStateSerialized
}

export type IndividualGameStateUpdatePayload = IndividualBidStateUploadPayload | IndividualAuctionStateUploadPayload

export type IndividualBidStateUploadPayload = {
	stage: Stage.Bidding
	propertyCards: Card[]
	bank: number
}

export type IndividualAuctionStateUploadPayload = {
	stage: Stage.Auctioning
	bank: number
	propertyCards: Card[]
	cashCards: Card[]
}

export interface ServerToClientEvents {
	PlayerJoin: (payload: Player) => void
	PlayerLeave: (payload: Player) => void
	GameStateUpdate: (payload: GameStateUpdatePayload) => void
	IndividualGameStateUpdate: (payload: IndividualGameStateUpdatePayload) => void
	PlayerInitialization: (payload: PlayerInitializationPayload) => void
	PlaySound: (payload: { sound: Sound }) => void
}
