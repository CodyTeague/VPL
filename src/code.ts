const test = [null, 1, 11, 0, 11, 0, null, null, 'cody'];
const id = '18Q1V1qYU9vFpDT4Szo8EhPlirKBoX7TDK8oLW-pcWxg';
const backingData = 'backing_data';

const TEAM_NUMBER = 'Team #';
const TEAM_NAME = 'Team Name';

const SHEETS_LINK = "https://docs.google.com/spreadsheets/d/18Q1V1qYU9vFpDT4Szo8EhPlirKBoX7TDK8oLW-pcWxg/edit#gid=938874692";
const FORM_LINK = "https://docs.google.com/a/veeva.com/forms/d/e/1FAIpQLSdbl9QbM47RMxaFDUA1AikMo8NRKCc8rXwjTvwbpo8DtmV6Iw/viewform";
const DOCS_LINK ="https://docs.google.com/document/d/1k-JYA-LXXHrBSpjEQpzBhNTe-i6WtK7zw9YQQS1STcY/edit"

import { sheetApp } from './gscripts';

// // returns 2 divisions and their records, unsorted
// function getRecords() {
//     var data = getSpreadsheetData(backingData);
//     var teamsMan = [];
    
//    for (var i = 1; i <= 10; i++) {
//         teamsMan.push({ team: i, wins: 0, losses: 0 });
//     }
    
//     data.forEach((row) => {
//         const winner = row['match_winner'];
//         if (winner) {
//             const loser = winner == row['team_a'] ? row['team_b'] : row['team_a'];
//             teamsMan[winner - 1]['wins']++;
//             teamsMan[loser - 1]['losses']++;
//         }
//     });
    
//     teamsMan.forEach((team) =>
//         team['win_pct'] = getWinPct(team)
//     );
    
//     return [teamsMan.slice(0, 5), teamsMan.slice(5)];
// }

// // get all the matches for a given week
// function getMatches(weekNumber){
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
    
// }

// // Send out a preview email to all the players with the current standings and upcoming games
// function sendOutWeekPreview() {
//   const teams = getSpreadsheetData('Team Rosters');
  
//   const currentWeek = 1;
//   // get records and display as well
  
//   const allMatches = getMatches(currentWeek);
  
//   teams.forEach((team) => {
//     const teamMatches = allMatches.filter((match) => 
//       team[TEAM_NUMBER] == match['team_a'] || team[TEAM_NUMBER] == match['team_b']
//     );
    
//     const htmlBody = constructWeeklyPreviewEmail(team, teamMatches, teams, currentWeek);
//     mailApp().sendEmail({
//       to: team['email_one'] + "," + team['email_two'],
//       subject: "VPL Week " + currentWeek + " Preview",
//       htmlBody: htmlBody,
//     });
//   });
// }

// // build weekly preview email body
// function constructWeeklyPreviewEmail(receivingTeam, matches, teams, weekNumber){
//     var t = htmlService().createTemplateFromFile('mail_template');
    
//     var matches = matches.map(function(match) {
//       var teamA = teams[match['team_a'] - 1][TEAM_NAME]
//       var teamB = teams[match['team_b'] - 1][TEAM_NAME]
//       return {'gameNumber': match['game_number'], 'teamA': teamA, 'teamB': teamB}
//     });
    
//     t.data = {
//       'weekNumber': weekNumber ,
//       'weekString': '12/10 - 12/14',
//       'matches': matches,
//       'sheetsLink': SHEETS_LINK,
//       'formLink': FORM_LINK,
//       'docsLink': DOCS_LINK,
//     }
//     return t.evaluate().getContent();
// }

// function testOnFormSubmit() {
// //  9	6	11	4	11
// //  12/10/2018 19:41:24, 9, 6, 11, 4, 11, , , CODY, cody.teague@veeva.com,
//     var values = [, 9, 6, 11, 4, 11, '', '', 'cody'];
//     var e = { 'values': values };
//     onFormSubmit(e);
// }

// function onFormSubmit(e) {
//   //
//     // timestamp, game #, a1, b1, a2, b2, a3, b3, name
//     var _a = e.values, timestamp = _a[0], gameNumber = _a[1], aOne = _a[2], bOne = _a[3], aTwo = _a[4], bTwo = _a[5], aTre = _a[6], bTre = _a[7], name = _a[8];
//     var aWinsOne = teamAWins(aOne, bOne);
//     var aWinsTwo = teamAWins(aTwo, bTwo);
//     var aWinsTre = aWinsOne != aWinsTwo ? teamAWins(aTre, bTre) : undefined;
//     var aWinsAll = aWinsOne != aWinsTwo ? aWinsTre : aWinsOne;
//     recordScore(gameNumber, aWinsAll, aOne, bOne, aWinsOne, aTwo, bTwo, aWinsTwo, aTre, bTre, aWinsTre, name);
//     updateRankings();
// }

// export function teamAWins(teamAScore: number, teamBScore: number): boolean {
//     const win = 11;
//     if (teamAScore < win && teamBScore < win) {
//         throw ('Invalid score, nobody got to 11');
//     }
//     else if (Math.abs(teamAScore - teamBScore) < 2) {
//         throw ('Invalid score, must win by two');
//     }
//     else {
//         return teamAScore > teamAScore;
//     }
// }

// function getSpreadsheetData(sheetName) {
//     // This function gives you an array of objects modeling a worksheet's tabular data, where the first items — column headers — become the property names.
//     var arrayOfArrays = sheetApp().openById(id).getSheetByName(sheetName).getDataRange().getValues();
//     var headers = arrayOfArrays.shift();
//     return arrayOfArrays.map(function (row) {
//         return row.reduce(function (memo, value, index) {
//             if (value) {
//                 memo[headers[index]] = value;
//             }
//             return memo;
//         }, {});
//     });
// }

// function updateRankings() {
//     var records = getRecords();
    
//     postRankings(records[0], true); // orange
//     postRankings(records[1], false); // cloud
// }

// gets how many games teamB is behind teamA
export function gamesBehind(teamA, teamB) {
    return ((teamA['wins'] - teamA['losses']) - (teamB['wins'] - teamB['losses'])) / 2;
}

function postRankings(records, orange) {
    records.sort(function (teamA, teamB) {
        return getWinPct(teamB) - getWinPct(teamA);
    });
    var rank = 1;
    var firstPlace = records[0];
    records.forEach(function (team, index) {
        team['rank'] = rank;
        team['games_behind'] = team === firstPlace ? 0 : gamesBehind(firstPlace, team);
        if (index + 1 < records.length
            && team['win_pct'] !== records[index + 1]['win_pct']) {
            rank++;
        }
    });
    var i = 0;
    var board = orange ? 'leaderboard_data_orange' : 'leaderboard_data_cloud';
    var ss = sheetApp().openById(id).getSheetByName(board);
    var data = [];
    records.forEach(function (team) {
        data.push([team['rank'], team['team'], team['wins'], team['losses'], team['win_pct'], team['games_behind']]);
    });
    var range = ss.getRange(2, 1, data.length, 6);
    range.setValues(data);
}

export function getWinPct(team) {
    // has both wins and losses
    if (team['wins'] && team['losses']) {
        return ((team['wins'] * 1.0) / (team['wins'] + team['losses']));
    }
    else if (team['wins']) {
        return 1;
    }
    else if (team['losses']) {
        return -1;
    }
    else {
        return 0;
    }
}

// function recordScore(gameNumber, aWinsAll, aOne, bOne, aWinsOne, aTwo, bTwo, aWinsTwo, aTre, bTre, aWinsTre, name) {    
//     var ss = sheetApp().openById(id).getSheetByName(backingData);
//     var data = getSpreadsheetData(backingData);
//     var row = 0;
//     while (row < data.length) {
//         if (data[row]['game_number'] == gameNumber) {
//             break;
//         } 
//         row++
//     }
//     if (row === data.length) {
//         throw ('Game number not found');
//     }
//     // check values to make sure we aren't overwriting data
//     var range = ss.getRange(row + 2, 5, 1, 11);
//     var entry = range.getValues()[0];
//     entry.forEach(function (value) {
//         if (value) {
//             throw ('Error: data in row');
//         }
//     });
//     //  match_winner, a_score_first, b_score_first, winner_first, a_score_second, b_score_second, winner_second, a_score_third, b_score_third, winner_third, recorder
//     var teamsHere = ss.getRange(row + 2, 3, 1, 2).getValues()[0];
//     var teamA = teamsHere[0];
//     var teamB = teamsHere[1];
//     var allWinner = aWinsAll ? teamA : teamB;
//     var oneWinner = aWinsOne ? teamA : teamB;
//     var twoWinner = aWinsTwo ? teamA : teamB;
//     var treWinner = aWinsOne != aWinsTwo
//         ? aWinsTre ? teamA : teamB
//         : '';
//     var newEntry = [[allWinner, aOne, bOne, oneWinner, aTwo, bTwo, twoWinner,
//             aTre, bTre, treWinner, name]];
//     range.setValues(newEntry);
// }