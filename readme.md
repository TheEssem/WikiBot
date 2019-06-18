# wikibot
wikibot is an extremely small Twitter bot designed to post a random snippet from a MediaWiki-based wiki every 30 minutes. It is the code powering [@MCWikiBot](https://twitter.com/MCWikiBot).

## Usage
First of all, run this to install dependencies:
```
npm install
```
You will need to create a [Twitter developer account](https://developer.twitter.com/en/apply-for-access.html). When you have your developer account, you will need to create an app and copy the access token, access secret, consumer key, and consumer secret into `config.json`. From there you can copy in the link to the API endpoint for the wiki you're using and blacklist any words. After that, run this to start the bot:
```
node index.js
```

## Contributing
Pull requests and issue reports are gladly accepted.
