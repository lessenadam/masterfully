var _ = require('lodash/core');

module.exports = {
  ordinal_suffix_of: function (i) {
      var j = i % 10,
          k = i % 100;
      if (j == 1 && k != 11) {
          return i + "st";
      }
      if (j == 2 && k != 12) {
          return i + "nd";
      }
      if (j == 3 && k != 13) {
          return i + "rd";
      }
      return i + "th";
  },
  calculatePerformance: (snapShotData) => {
    var getScore = (snapShot) => {
      // calculate percentages and return a 0-10 score based on weighting 
      var {happiness, disgust, fear, surprise, anger, sadness} = snapShot;
      var pointTotal = happiness + disgust + fear + surprise + anger + sadness;
      if (happiness / pointTotal >= .25) {
        return 9;
      } else if (disgust / pointTotal >= .25 || fear / pointTotal >= .25 || surprise / pointTotal >= .25) {
        return 1;
      } else if (sadness / pointTotal >= .25 || anger / pointTotal >= .25) {
        return 6.5;
      } else {
        return 4;
      }
    };
    var scoreTuples = snapShotData.map(snap => [snap.sessionId, getScore(snap)]);
    var results = {};
    // loop over score tuples and build out obj with sessionId:[scores]
    scoreTuples.forEach(tuple => {
      var scores = results[tuple[0]] || [];
      scores.push(tuple[1]);
      results[tuple[0]] = scores;
    });
    _.forEach(results, (scores, sessionId) => 
      results[sessionId] = (scores.reduce((prevValue, currValue) => prevValue + currValue ) / scores.length)
    );
    var data = [];
    for (var id in results) {
      data.push(id);
    }
    data = data.sort((a,b) => a-b);
    _.forEach(data, (sessionId, index) => 
        data[index] = {score:(Math.round(results[sessionId]*10)/10), index:index + 1, sessionId:sessionId}
      )


    return data;
  }
};
  