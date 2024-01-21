type SessionID = string
interface SessionData {
	nickname: string
	connected: boolean
}
/* abstract */ class SessionStore {
	findSession(id: SessionID) {}
	saveSession(id: SessionID, session: SessionData) {}
	findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
	sessions: Map<SessionID, SessionData>
	constructor() {
		super()
		this.sessions = new Map()
	}

	hasSession(sessionId: SessionID): boolean {
		return this.sessions.has(sessionId)
	}

	findSession(sessionId: SessionID): SessionData | undefined {
		return this.sessions.get(sessionId)
	}

	saveSession(sessionId: SessionID, session: SessionData): void {
		this.sessions.set(sessionId, session)
	}

	findAllSessions() {
		return [...this.sessions.values()]
	}
}

export { InMemorySessionStore }
