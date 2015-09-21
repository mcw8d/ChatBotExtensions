///<reference path="../local-typings/page-mod.d.ts" />
import pageMod = require('sdk/page-mod');

pageMod.PageMod({
    include: /.*talkgadget\.google\.com.*/,
    contentScriptFile: ['./jquery.js', './bot.js']
});
