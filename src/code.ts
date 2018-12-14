// Spreadsheet info constants
const id = '18Q1V1qYU9vFpDT4Szo8EhPlirKBoX7TDK8oLW-pcWxg';
const backingData = 'backing_data';

// Constants for spreadsheet headers
const TEAM_NUMBER = 'Team #';
const TEAM_NAME = 'Team Name';
const PARTNER_ONE = 'Partner One'
const PARTNER_TWO = 'Partner Two'

// Links
const SHEETS_LINK = "https://docs.google.com/spreadsheets/d/18Q1V1qYU9vFpDT4Szo8EhPlirKBoX7TDK8oLW-pcWxg/edit#gid=938874692";
const FORM_LINK = "https://docs.google.com/a/veeva.com/forms/d/e/1FAIpQLSdbl9QbM47RMxaFDUA1AikMo8NRKCc8rXwjTvwbpo8DtmV6Iw/viewform";
const DOCS_LINK ="https://docs.google.com/document/d/1k-JYA-LXXHrBSpjEQpzBhNTe-i6WtK7zw9YQQS1STcY/edit"

import { sheetApp, htmlService, mailApp } from './gscripts';

// returns 2 divisions and their records, unsorted
function getRecords() {
    const teams = Array(10).map((val, i) => ({ team: i + 1, wins: 0, losses: 0 }));
    
    // get wins and losses
    getSpreadsheetData(backingData).forEach((row) => {
        const winner = row['match_winner'];
        if (winner) {
            const loser = winner == row['team_a'] ? row['team_b'] : row['team_a'];
            teams[winner - 1]['wins']++;
            teams[loser - 1]['losses']++;
        }
    });
    
    // assign win pct
    teams.forEach((team) =>
        team['win_pct'] = getWinPct(team)
    );
    
    return [teams.slice(0, 5), teams.slice(5)];
}

// get all the matches for a given week
function getMatches(weekNumber){
    return getSpreadsheetData(backingData).filter(row => row['week_number'] == weekNumber)
    // not sure if the above will work
//   const data = getSpreadsheetData(backingData);
//   let row = 0;
//   const matches = [];
  
//   while (row < data.length) {
//         const currentWeekNumber = data[row]['week_number'];
//         if(currentWeekNumber === weekNumber){
//           matches.push(data[row])
//         }
//         else if (currentWeekNumber > weekNumber) {
//             break;
//         }
//         row++;
//     }
    
//     if (matches.length === 0) {
//         throw ('No games could be found for the weekNumber: ' + weekNumber);
//     }
    
//     return matches;
    
}

// Send out a preview email to all the players with the current standings and upcoming games
function sendOutWeekPreview() {
  const teams = getSpreadsheetData('Team Rosters');
  
  const currentWeek = 1;
  // get records and display as well
  
  const allMatches = getMatches(currentWeek);
  
  const records = getLeaderboard();
  teams.forEach((team) => {
    const teamMatches = allMatches.filter((match) => 
      team[TEAM_NUMBER] == match['team_a'] || team[TEAM_NUMBER] == match['team_b']
    );
    
    const htmlBody = constructWeeklyPreviewEmail(team, teamMatches, teams, currentWeek, records);
    mailApp().sendEmail({
      to: team['email_one'] + "," + team['email_two'],
      subject: "VPL Week " + currentWeek + " Preview",
      htmlBody: htmlBody,
    });
  });
}

function getLeaderboard(){

}

// build weekly preview email body
function constructWeeklyPreviewEmail(receivingTeam, matches, teams, weekNumber, records){
    const t = htmlService().createTemplateFromFile('mail_template');
    
    const newMatches = matches.map((match) => {
        const teamA = teams[match['team_a'] - 1][TEAM_NAME]
        const teamB = teams[match['team_b'] - 1][TEAM_NAME]
        const teamNumber = receivingTeam[TEAM_NUMBER]
        const isTeamA = match['team_a'] == teamNumber
        const opposingTeam = match[isTeamA ? 'team_b' : 'team_a']
        const opponentOne = teams[opposingTeam][PARTNER_ONE]
        const opponentTwo = teams[opposingTeam][PARTNER_TWO]
        return {
                'gameNumber': match['game_number'],
                'teamA': teamA,
                'teamB': teamB,
                'opponentOne': opponentOne,
                'opponentTwo' : opponentTwo,
            }
    });
    
    t.data = {
      'weekNumber': weekNumber ,
      'weekString': '12/10 - 12/14',
      'matches': newMatches,
      'sheetsLink': SHEETS_LINK,
      'formLink': FORM_LINK,
      'docsLink': DOCS_LINK,
    }

    return t.evaluate().getContent();
}

function testOnFormSubmit() {
    const values = [, 9, 6, 11, 4, 11, '', '', 'cody'];
    const e = { 'values': values };
    onFormSubmit(e);
}

function onFormSubmit(e) {
  //
    // timestamp, game #, a1, b1, a2, b2, a3, b3, name
    const [ , gameNumber, aOne, bOne, aTwo, bTwo, aTre, bTre, name] = e.values;
    const aWinsOne = teamAWins(parseInt(aOne), parseInt(bOne));
    const aWinsTwo = teamAWins(parseInt(aTwo), parseInt(bTwo));
    const aWinsTre = aWinsOne != aWinsTwo ? teamAWins(parseInt(aTre), parseInt(bTre)) : undefined;
    const aWinsAll = aWinsOne != aWinsTwo ? aWinsTre : aWinsOne;
    recordScore(gameNumber, aWinsAll, aOne, bOne, aWinsOne, aTwo, bTwo, aWinsTwo, aTre, bTre, aWinsTre, name);
    updateRankings();
}

export function teamAWins(teamA: number, teamB: number): boolean {
    const win = 11;
    if (teamA < win && teamB < win) {
        throw ('Invalid score, nobody got to 11');
    }
    else if (Math.abs(teamA - teamB) < 2) {
        throw ('Invalid score, must win by two');
    }
    else {
        return teamA > teamB;
    }
}

function getSpreadsheetData(sheetName) {
    // This function gives you an array of objects modeling a worksheet's tabular data, where the first items — column headers — become the property names.
    const arrayOfArrays = sheetApp().openById(id).getSheetByName(sheetName).getDataRange().getValues();
    const headers = arrayOfArrays.shift();
    return arrayOfArrays.map((row) => {
        return row.reduce((memo, value, index) => {
            if (value) {
                memo[headers[index]] = value;
            }
            return memo;
        }, {});
    });
}

function updateRankings() {
    const [orangeRecords, cloudRecords] = getRecords();
    postRankings(orangeRecords, true); // orange
    postRankings(cloudRecords, false); // cloud
}

// gets how many games teamB is behind teamA
export function gamesBehind(teamA, teamB) {
    return ((teamA['wins'] - teamA['losses']) - (teamB['wins'] - teamB['losses'])) / 2;
}

function postRankings(records, orange) {
    records.sort((teamA, teamB) => sortTeams(teamA, teamB));

    const firstPlace = records[0];

    let rank = 1;
    records.forEach((team, index) => {
        team['rank'] = rank;
        team['games_behind'] = team === firstPlace ? 0 : gamesBehind(firstPlace, team);
        if (index + 1 < records.length
            && team['win_pct'] !== records[index + 1]['win_pct']) {
            rank++;
        }
    });
    var board = orange ? 'leaderboard_data_orange' : 'leaderboard_data_cloud';
    var ss = sheetApp().openById(id).getSheetByName(board);
    var data = [];
    records.forEach(function (team) {
        data.push([team['rank'], team['team'], team['wins'], team['losses'], team['win_pct'], team['games_behind']]);
    });
    var range = ss.getRange(2, 1, data.length, 6);
    range.setValues(data);
}

export function sortTeams(teamA, teamB){
    if(getWinPct(teamA) !== getWinPct(teamB)){
        return getWinPct(teamB) - getWinPct(teamA)
    } else if (teamA['wins'] !== teamB['wins']){
        return teamB['wins'] - teamA['wins']
    } else if (teamA['losses'] !== teamB['losses']){
        return teamA['losses']- teamB['losses'] 
    } else {
        return 0;
    }
}

export function getWinPct(team) {
    if (team['wins'] && team['losses']) {
        return (team['wins'] / (team['wins'] + team['losses']));
    }
    else if (team['wins']) {
        return 1;
    }
    else {
        return 0;
    }
}

function recordScore(gameNumber, aWinsAll, aOne, bOne, aWinsOne, aTwo, bTwo, aWinsTwo, aTre, bTre, aWinsTre, name) {    
    const ss = sheetApp().openById(id).getSheetByName(backingData);
    const data = getSpreadsheetData(backingData);
    let row = 0;
    while (row < data.length) {
        if (data[row]['game_number'] == gameNumber) {
            break;
        } 
        row++
    }
    if (row === data.length) {
        throw ('Game number not found');
    }
    // check values to make sure we aren't overwriting data
    const range = ss.getRange(row + 2, 5, 1, 11);
    const entry = range.getValues()[0];
    entry.forEach(function (value) {
        if (value) {
            throw ('Error: data in row');
        }
    });
    
    const [teamA, teamB] = ss.getRange(row + 2, 3, 1, 2).getValues()[0];

    const allWinner = aWinsAll ? teamA : teamB;
    const oneWinner = aWinsOne ? teamA : teamB;
    const twoWinner = aWinsTwo ? teamA : teamB;
    const treWinner = aWinsOne != aWinsTwo
        ? aWinsTre ? teamA : teamB
        : '';
//  match_winner, a_score_first, b_score_first, winner_first, a_score_second, b_score_second, winner_second, a_score_third, b_score_third, winner_third, recorder
    const newEntry = [[allWinner, aOne, bOne, oneWinner, aTwo, bTwo, twoWinner, aTre, bTre, treWinner, name]];
    range.setValues(newEntry);
}