'use strict';

import { getWinPct , gamesBehind} from '../code';

test('test getWinPct gets correct win percentage', () => {
    const team = {'wins': 4, 'losses': 6}
    expect(getWinPct(team)).toBe(0.4)
})

describe('games behind returns correct number of games', () => {
    test('games behind returns 1 when a team has 1 less win and 1 more loss', () => {
        const teamA = {'wins': 3, 'losses': 3}
        const teamB = {'wins': 2, 'losses': 4}

        expect(gamesBehind(teamA, teamB)).toBe(1)
    })
    test('games behind returns 0.5 when a team trails behind a single win', () => {
        const teamA = {'wins': 3, 'losses': 3}
        const teamB = {'wins': 2, 'losses': 3}

        expect(gamesBehind(teamA, teamB)).toBe(0.5)
    })
})