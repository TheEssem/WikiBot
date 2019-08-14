const request = require("node-fetch");
const Twit = require("twit");
const config = require("./config.json");
const client = new Twit({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumerSecret,
  access_token: config.accessToken,
  access_token_secret: config.accessSecret
});

const getArticle = () => {
  const source = config.wikiURLs[Math.floor(Math.random() * config.wikiURLs.length)];
  request(`${source}?action=query&format=json&generator=random&prop=extracts&explaintext&grnnamespace=0&requestid=${Math.floor(Math.random() * 999999).toString()}`)
    .then(res => res.json())
    .then(data => parseArticle(data, source))
    .catch(error => { throw new Error(error); });
};

function getFirstProp(obj) {
  for (const i in obj) return obj[i];
}

function parseArticle(data, source) {
  const s = getFirstProp(data.query.pages).extract;
  const headerRegex = /=+ .+? =+/g;
  const regex = /(\b\S+[.?!]["']?\s*)/g;
  const subst = "$1#";
  const cleaned = s.replace(headerRegex, "");
  const stringArray = cleaned.replace(headerRegex, "").replace(regex, subst).split(/#/).filter(n => n);
  if (stringArray.length !== 0) {
    const finalString = stringArray[Math.floor(Math.random() * stringArray.length)].substring(0, 280).trim();
    if (config.blacklist.some(r => finalString.includes(r))) {
      if (!finalString.match(/^\d/)) {
        client.post("statuses/update", { status: finalString }, function(error, data2, response) {
          if (error) console.error;
          console.log(`Successfully posted tweet with ID ${data2.id}`);
          console.log(`Response: ${response.statusCode} ${response.statusMessage}`);
          client.post("statuses/update", { status: `${config.accountHandle} Source: ${source.split("api.php")[0]}${getFirstProp(data.query.pages).title.split(" ").join("_")}`, in_reply_to_status_id:  data2.id }, function(error, data3, response2) {
            if (error) console.error;
            console.log(`Successfully posted source with ID ${data3.id}`);
            console.log(`Response: ${response2.statusCode} ${response2.statusMessage}`);
          });
        });
      } else {
        setTimeout(getArticle, 100);
      }
    } else {
      setTimeout(getArticle, 100);
    }
  } else {
    setTimeout(getArticle, 100);
  }
}

getArticle();
setInterval(getArticle, 1800000);
