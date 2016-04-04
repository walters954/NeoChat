/**
 * This file defines console command logic.
 */


import {IUser} from './chat-session';
export default function(io, session) {
var commands:IChatCommandMap = {
	"nick": {
		numArgs: 1,
		handler: function(args, io, session, player) {
			player.nick = args[0];
			session.players[player.uuid] = player;
			io.sockets.emit('nickname', player.nick);
		}
	},
	"clear": {
		numArgs: 0,
		handler: function(args, io, session, player) {
			player.socket.emit('clear');
		}
	},
	"help": {
		numArgs: 0,
		handler: function(args, io, session, player) {
			player.socket.emit('message', '/nick <nickname> - change your username\n /clear - clear your chat log.', player.currentChat);
		}
	},
	"list": {
		numArgs: 1,
		handler: function(args, io, session, player) {
			var channelList = [];

			if (args[0] != null)
			{
				var allChannels = Object.getOwnPropertyNames(session.channels);
				for (var i = 0; i < allChannels.length; i++)
				 {
					 if (allChannels[i].indexOf(args[0]) > -1)
					 {
						 channelList.push(allChannels[i]);
					 }
				 }
			}
			else
			{
				channelList = Object.getOwnPropertyNames(session.channels);
			}
			player.socket.emit('message', 'Channel List: '+ channelList, player.currentChat);
		}
	},
	"quit": {
		numArgs: 0,
		handler: function(args, io, session, player) {
			io.sockets.emit('message', player.nick + ' has quit...', player.currentChat);
			player.quit = true;
		}
	},
	"join": {
		numArgs: 0,
		handler: function(args, io, session, player) {
			player.quit = false;
			io.sockets.emit('message', player.nick + ' has joined!!!', player.currentChat);

		}
	},
	"promote": {
			numArgs: 1,
			handler: function(args, io, session, player) {
				var promoplayer = args.join().replace(',','')
				var playerFound = '';
				// if (player.type === 'mod')
				// {
					var puser : string//: IUser;
					// let xuser : IUser;
					let iterable = session.users
// console.log(session.users);
					// for (puser in session.users)
					// {
					// 	console.log(session.users[puser])
					// 	// playerFound = puser.nick
					// }

					for (let [key, value] of iterable)
					{
						console.log(value)
						// playerFound = puser.nick
					}
				// for (var i = 1; i < Object.getOwnPropertyNames(session.users).length - 1; i++)
				// {
				// 	console.log( Object.getOwnPropertyNames(session.users)[i])
				// 	if (promoplayer == session.users[Object.getOwnPropertyNames(session.users)[i]].nick)
				// 	{
				// 		playerFound = promoplayer;
				//
				// 	}
				// 	else
				// 	{
				// 		playerFound = 'you have failed looking for ' + promoplayer + '------' + args.join().replace(',','')
				// 	}
				// }
					io.sockets.emit('message', playerFound, player.currentChat);
				// }
			}
		}
}


var isCommand = function(msg) {
	return (msg.substring(0, 1) == "/");
}

/**
 * Runs a given command.
 * Parses a command into a name and a series of arg tokens.
 * @param  {Object}
 * @param  {String}
 */
var run = function(player:any, msg:string) {
	var cmd = msg.substring(1, msg.length);
	var args = cmd.match(/[0-9A-z][a-z]*/g);
	var fun = args.shift();

	commands[fun].handler(args, io, session, player);
}

	return {
		run: run,
		isCommand: isCommand
	}
};

interface IChatCommand {
	numArgs: number,
	handler: (args?:any, io?:any, session?:any, player?:any) => any
}
interface IChatCommandMap {
	[command:string]:IChatCommand
}
