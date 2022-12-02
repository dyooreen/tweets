const Twit = require("twit");
const io = require("./socket")();

const T = new Twit({
  consumer_key: "CbYq2sfIqMYZMc5TLMBZuAIe0",
  consumer_secret: "uEqtENrLcXuGABWXfv3QxglIgYbJKWYFY6sqHeGSjBzxM9mgkg",
  access_token: "1255567235785031681-Q5KEWs9FnNfzNmBKqL1BGDAAk2mtPM",
  access_token_secret: "gbc0ynDIIEv4nTo5SUYFZNlUboB8E4LnWYA4jDwhcZ89C",
  timeout_ms: 60 * 1000,
  strictSSL: true,
});

const OldStatuses = {}; // KEY: query, Value: [statuses]

const searchTweet = (query, callback) => {
  T.get(
    "search/tweets",
    { geocode: `${query},5km`, count: 1000 },
    (err, data, response) => {
      if (err) {
        console.log("ERROR: ", err);
        return;
      }
      if (!(query in OldStatuses)) {
        OldStatuses[query] = [];
      }
      for (let i = 0; i < data.statuses.length; i++) {
        const newId = data.statuses[i].id;
        let isEqual = false;
        for (let j = 0; j < OldStatuses[query].length; j++) {
          const oldId = OldStatuses[query][j].id;
          if (oldId === newId) {
            isEqual = true;
            break;
          }
        }

        if (!isEqual) {
          OldStatuses[query] = data.statuses;
          io.sockets.emit(query, { statuses: data.statuses });
          break;
        }
      }
    }
  );
};

const queries = [];
let index = -1;

setInterval(() => {
  if (index < 0 && queries.length === 0) return;

  index++;
  if (index >= queries.length) {
    index = 0;
  }

  searchTweet(queries[index], (tweets) => {
    console.log(tweets);
  });
}, 5000);

module.exports = {
  search(query) {
    if (queries.indexOf(query) === -1) {
      queries.unshift(query);
    }
  },
};
