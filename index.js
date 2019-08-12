const Discord = require('discord.js');
const fetch = require('node-fetch');
const client = new Discord.Client();

// CHEF RESPONSES

const recipefetcherr = 'Recipes unavailable at this time. Please try again later, or contact sysadmin for help.';
const ingredfetcherr = 'Ingredients unavailable at this time. Please try again later, or contact sysadmin for help.';

client.on('message', msg => {
	if (!msg.author.bot){
		if (msg.content.toLowerCase().indexOf('--recipe') >= 0){
			const x = msg.content.indexOf('[');
			const y = msg.content.indexOf(']');
			if (x >= 0 && y >= 0 && y - x > 1){
				var q = msg.content.toLowerCase().substring(x+1,y);
				for(var i = 0; i < q.length; i++){
					if(q.substring(i, i+1) == ' '){
						q = q.substring(0, i) + '%20' + q.substring(i+1);
					}
				}
				console.log(q);
				fetch('https://api.spoonacular.com/recipes/search?apiKey=393838a1ac2c4a5693bda94a1fb68e27&query=' + q + '&number=1')
					.then(resp => resp.json())
					.then(function(data){
						console.log(data);
						const d = data['results'][0]['id'];
						fetch('https://api.spoonacular.com/recipes/' + d + '/information?apiKey=393838a1ac2c4a5693bda94a1fb68e27')
						.then(resp => resp.json())
						.then(function(data2){
							msg.reply('Your search returned this:\n' + data2['sourceUrl']);
						})
						.catch(function(error){
							msg.reply(recipefetcherr);
						});
					})
					.catch(function(error){
						msg.reply(recipefetcherr);
					});
			}else{
				fetch('https://api.spoonacular.com/recipes/random?apiKey=393838a1ac2c4a5693bda94a1fb68e27&number=1')
					.then(resp => resp.json())
					.then(function(data){
						msg.reply(data['recipes'][0]['sourceUrl']);
					})
					.catch(function(error){
						msg.reply(recipefetcherr);
					});
			}
		}else if (msg.content.toLowerCase().indexOf("--roast") >= 0){
			fetch('https://gist.githubusercontent.com/bnidevs/f3327cd39ddc53745fc49d07eed4c4cb/raw/7ad3721b147bf9037a73a476f1f18cd9d005ac47/insults.txt')
				.then(resp => resp.text())
				.then(function(data){
					const which = Math.floor(Math.random() * 22);
					msg.reply(data.split('\n')[which]);
				})
				.catch(function(error){
					msg.reply('Where is the lamb sauce?');
				});
		}else if (msg.content.toLowerCase().indexOf("--foodjoke") >= 0){
			fetch('https://api.spoonacular.com/food/jokes/random?apiKey=393838a1ac2c4a5693bda94a1fb68e27')
				.then(resp => resp.json())
				.then(function(data){
					msg.reply(data['text']);
				})
				.catch(function(error){
					msg.reply('Any salad can be a Caesar salad if you stab it enough.');
				});
		}else if (msg.content.toLowerCase().indexOf("??howto") >= 0){
			msg.reply("\n`--recipe` - Fetches a random recipe\n`--recipe [SEARCH QUERY]` - Searches for a recipe based on your query\n`??{NUTRITION TYPE} [FOOD]` - Fetches nutrition info for a food\n`--roast` - Get destroyed by Gordon Ramsay\n`--foodjoke` - It's a food joke, completely harmless");
		}else if (msg.content.toLowerCase().indexOf("??") >= 0){
			var b = false;
			var nutrif;
			var srchtm;
			try {
				nutrif = msg.content.substring(msg.content.toLowerCase().indexOf('{') + 1, msg.content.toLowerCase().indexOf('}')).toLowerCase();
				srchtm = msg.content.substring(msg.content.toLowerCase().indexOf('[') + 1, msg.content.toLowerCase().indexOf(']')).toLowerCase();
			}
			catch(error) {
				b = true;
				msg.reply("Format incorrect, please try again.");
			}

			if(!b){
				fetch('https://api.spoonacular.com/food/products/search?apiKey=393838a1ac2c4a5693bda94a1fb68e27&query=' + srchtm + '&number=1')
					.then(resp => resp.json())
					.then(function(data){
						const ingredid = data['products'][0]['id'];
						fetch('https://api.spoonacular.com/food/products/' + ingredid + '?apiKey=393838a1ac2c4a5693bda94a1fb68e27')
						.then(resp => resp.json())
						.then(function(data){
							if(data['nutrition'].hasOwnProperty(nutrif) && data['nutrition'][nutrif] != null){
								msg.reply(data['title'] + '\n' + nutrif + ': ' + data['nutrition'][nutrif] + (data['serving_size'] != null ? ' for ' + data['serving_size'] : ""), {files: [data['images'][0]]});
							}else{
								msg.reply('Nutrition type not listed, please try another nutrition type or contact sysadmin for more info.');
							}
						})
						.catch(function(error){
							msg.reply(ingredfetcherr);
						});
					})
					.catch(function(error){
						msg.reply(ingredfetcherr);
					});
			}
		}else{
			const mtns = msg.mentions.users.array();
			for (var k in mtns){
				if (mtns[k].bot){
					msg.reply('Use `??howto` for valid commands');
					break;
				}
			}
		}
	}
});

client.login('NjA2NDk1MDQzMDQ1Mjk0MDky.XUL8ng.av3jDDEx-P-78Rshap8oEr-Cooc');