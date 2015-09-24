///<reference path="../local-typings/page-mod.d.ts" />
///<reference path="../local-typings/self.d.ts" />
import pageMod = require('sdk/page-mod');
import self = require('sdk/self');

pageMod.PageMod({
    include: /.*talkgadget\.google\.com.*/,
    contentScriptFile: ['./jquery.js', './commands.js', './bot.js'],
    contentScriptOptions: {
        version: self.version
    }
});
