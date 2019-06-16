const request = require("node-fetch");
const Twit = require("twit");
const config = require("./config.json");
const client = new Twit({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumerSecret,
  access_token: config.accessToken,
  access_token_secret: config.accessSecret
});

const getArticle = () => request(`${config.wikiURL}?action=query&format=json&generator=random&prop=extracts&explaintext&grnnamespace=0&requestid=${Math.floor(Math.random() * 999999).toString()}`)
  .then(res => res.json())
  .then(data => parseArticle(data))
  .catch(error => { throw new Error(error); });

function getFirstProp(obj) {
  for (const i in obj) return obj[i];
}

function parseArticle(data) {
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
        client.post("statuses/update", { status: finalString }, function(error, data) {
          if (error) console.error;
          console.log(`Successfully posted tweet with ID ${data.id}`);
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
