'use strict';

import { getWinPct , gamesBehind, teamAWins, sortTeams} from '../code';

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

describe('teamAWins works correctly', () => {
    test('returns true when team A beats B 11-0', () => {
        expect(teamAWins(11, 0)).toBe(true)
    })

    test('returns false when team A loses to B 0-11', () => {
        expect(teamAWins(0, 11)).toBe(false)
    })

    test('throws error when neither team has gotten to 11', () => {
        expect(() => teamAWins(5, 10)).toThrow()
    })

    test('throws error when a team does not win by 2', () => {
        expect(() => teamAWins(13, 12)).toThrow()
    })
})

describe('sortTeams sorts rankings correctly', () => {
    test('higher win pct teams are sorted correctly', () => {
        const first = {'wins': 1, 'losses': 0}
        const last = {'wins': 0, 'losses': 1}

        let teams = [last, first]

        teams.sort((a, b) => sortTeams(a, b))

        expect(teams[0]).toBe(first)
        expect(teams[1]).toBe(last)
    })

    test('teams with same win pct, more wins are first', () => {
        const first = {'wins': 2, 'losses': 0}
        const last = {'wins': 1, 'losses': 0}

        let teams = [last, first]

        teams.sort((a, b) => sortTeams(a, b))

        expect(teams[0]).toBe(first)
        expect(teams[1]).toBe(last)
    })

    test('teams with same win pct, fewer losses are first', () => {
        const first = {'wins': 0, 'losses': 1}
        const last = {'wins': 0, 'losses': 2}

        let teams = [last, first]

        teams.sort((a, b) => sortTeams(a, b))

        expect(teams[0]).toBe(first)
        expect(teams[1]).toBe(last)
    })
})