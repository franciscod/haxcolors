var   connect = require("connect")
    , locale  = require('locale')
    , swig    = require('swig')
    , marked  = require('marked')
    ,      fs = require('fs')
    ;

var langnames = []
  , lang_index = {}
  , supported_langs = []
  , lang_json = {};

swig.init({
    filters: { marked : function(input) { 
        var text = input.join('\n');
        return marked(text);
    }}, 
    root: __dirname + '/templates',
    autoescape: false 
});

var swig_index = swig.compileFile('index.html');

fs.readdir(__dirname + '/i18n/', function(err, files){
    if (err) throw err;
    var c = files.length;
    files.forEach(function(file){
        fs.readFile(__dirname + '/i18n/' + file, 'utf-8', function(err, data){
            if (err) throw err;
            var lang = file.split('.')[0];
            var json = JSON.parse(data);

            langnames.push([lang, json.langname]);
            supported_langs.push(lang);
            lang_json[lang] = json;

            if (--c === 0)
                supported_langs.map( function(lang) {
                    langnames.sort();
                    lang_json[lang].langnames = langnames;
                    lang_json[lang].lang = lang;
                    lang_index[lang] = swig_index.render(lang_json[lang]);
                    lang_json[lang] = 1;
                });
        });
    });
});

var supported = new locale.Locales(supported_langs);

var REDIRECT_TO_NEW_DOMAIN = 1;

connect()
    .use(connect.static(__dirname + '/static'))
    .use(function(req, res){

        if (REDIRECT_TO_NEW_DOMAIN) {
            res.writeHead(301, {'Location': 'http://haxcolors.com'});
            res.end();
            return;
        }

        var chosen_lang = req.url.split('/')[1]; //you have chosen
        if (!(chosen_lang in lang_json)) {
            var locales = new locale.Locales(req.headers["accept-language"]);
            chosen_lang = locales.best(supported).language; //or been chosen
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(lang_index[chosen_lang]);
    })
    .listen(process.env.PORT || 5000)
