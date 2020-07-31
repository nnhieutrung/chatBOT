const login = require("facebook-chat-api");
const fs = require("fs");
const config = require("./config.json");
const fetch = require("node-fetch");
const moment = require('moment-timezone');

let group = {};
let level = {};
    
login({appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8'))}, (err, api) => {
    if(err) return console.error(err);
    // Here you can use the api




	setInterval(function() 
	{
	  const docblacklist = fs.readFileSync('timeupdatelast.txt', 'utf8').trim();
	  var d = new Date();
	  var date = d.getDate();
	  var month = d.getMonth();
	  month = month + 1 ;
	  dateupdate = (' ' + date + ' ').trim();
	  if (dateupdate !== docblacklist)
	  {  
		var d = new Date();
		var datenow = d.getDate();
		var monthnow = d.getMonth();
		var yearnow = d.getFullYear();
		var daynow =(yearnow + ', ' + monthnow + ', ' +datenow );
		var now = new Date(daynow);
		var ngaythidaihoc = new Date('2020, 7, 9');
		var offset = ngaythidaihoc.getTime() - now.getTime(); 
		var songay = Math.round(offset / 1000 / 60 / 60 / 24);
		console.log('Đã Cập Nhật Số Ngày Trước Khi THi ĐH');
		api.sendMessage(' AUTO: Xin thông báo còn '+  songay  +  ' Ngày nữa là đến thi Đại Học rồi lo mà học đi các cậu ạ!! ', "2301729909928076");
        api.sendMessage(' AUTO: Xin thông báo còn '+  songay  +  ' Ngày nữa là đến thi Đại Học rồi lo mà học đi các cậu ạ!! ', "2621481251200080");
		api.sendMessage(' AUTO: Xin thông báo còn '+  songay  +  ' Ngày nữa là đến thi Đại Học rồi lo mà học đi các cậu ạ!! ', "2339237399428174");
		fs.writeFile('timeupdatelast.txt', dateupdate , function (err) {} );
	  }
	}, 120000);
	



   
	setInterval(function() 
	{
	  console.log('working');
	
	}, 2000);
	


	





    api.listenMqtt((err, message) => {
    	if(message.isGroup == false){
    		return;
    	}
    	let idGroup = message.threadID, idSender = message.senderID;
    	if(typeof group[idGroup] == "undefined"){
    		group[idGroup] = {};
    		level[idGroup] = {};
    	}

    	if(typeof group[idGroup][idSender] == "undefined"){
    		group[idGroup][idSender] = 0;
    		level[idGroup][idSender] = 0;
    	}
		let tin = message.body;
		if (!tin) return;
		if (tin.indexOf(config.prefix) !== 0) return;

        const args =  tin.slice(config.prefix.length).trim().split(/ +/g);
        const command = args[0].toLowerCase(); 
		
		if(command === 'test') {
			api.setMessageReaction("\uD83D\uDC4E", message.id);
			let name = '';
			api.getUserInfo(idSender,(err,x)=>
			{
			name = x[idSender].name;
			console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
			});
		}
	

		if(command == "idgroup"){
			api.setMessageReaction(":like:", message.messageID)
			let name = '';
		api.getUserInfo(idSender,(err,x)=>
		{
		name = x[idSender].name;
		console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
		});
	   api.sendMessage(message.threadID , message.threadID);
		};
     
    	if(command == "rank"){
			
    		// Get Rank
    		let countMessage = []; //Array to count msg of all member
    		let idMember = Object.keys(group[idGroup]);
    		idMember.map(data=>{
    			if(typeof data != "undefined" && data != "undefined"){
	    			let save = {count:group[idGroup][data],id:data}
	    			countMessage.push(save);
	    		}
    		});
    		countMessage.sort((a,b)=>b.count-a.count);

    		let cur = 1, rank = 1;
    		console.log(countMessage);
    		countMessage.map(data=>{
    			if(data.id == idSender){
    				rank = cur;
    				return;
    			}
    			cur++;
    		});
    		// End get rank
    		let name = '';
    		api.getUserInfo(idSender,(err,x)=>{
				name = x[idSender].name;
				console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
    			api.sendMessage(`Hi `+name+`!
Bạn đang ở rank: #` + rank + `
Số exp của bạn là: `+group[idGroup][idSender]+`
Level hiện tại: `+level[idGroup][idSender], message.threadID);	
    		});
    		
    	}
    	else if(command == "allrank"){
			
		api.getUserInfo(idSender,(err,x)=>
		{
		name = x[idSender].name;
		console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
		}); 
		    let name = '';
    		api.sendTypingIndicator(message.threadID);
    		// Get Rank
    		let countMessage = []; //Array to count msg of all member
    		let nameGr = []; //Array to count msg of all member
    		let idMember = Object.keys(group[idGroup]);
    		idMember.map(data=>{
    			if(typeof data != "undefined" && data != "undefined"){
	    			let save = {count:group[idGroup][data],id:data}
	    			countMessage.push(save);
	    			api.getUserInfo(data,(err,x)=>{
		    			name = x[data].name;
		    			nameGr[data] = name;
		    		});
	    		}
	    		
    		});
    		countMessage.sort((a,b)=>b.count-a.count);
    		let cur = 1, rank = 1;
    		let sendMsg = '';
    		setTimeout(()=>{
    			countMessage.map(data=>{
	    			sendMsg += 'Top '+ cur + ' là : '+ nameGr[data.id] +', có level: '+(group[idGroup][data.id] / 100 + 1)+'\n';
	    			++cur;
	    		});
	    		api.sendMessage(sendMsg, message.threadID);	
	    		
    		},2000);
    		
    		// End get rank
    	}
    	else if(command == "countmessage"){
			let name = '';
		api.getUserInfo(idSender,(err,x)=>
		{
		name = x[idSender].name;
		console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
		});
    		api.sendTypingIndicator(message.threadID);
    		api.getThreadInfo(message.threadID,(err,data)=>{
    			api.sendMessage('Tổng số tin nhắn !của group là: ' + data.messageCount, message.threadID);
    		});

    	}
    	else if(command == "help"){
			let name = '';
		api.getUserInfo(idSender,(err,x)=>
		{
		name = x[idSender].name;
		console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
		});
			api.sendMessage('Các lệnh có của bot: \n !countMessage: Đếm tổng số tin nhắn của nhóm \n !Rank: Lấy rank hiện tại của bạn  \n !allRank: Lấy danh sách rank của team \n !help: Hiển thị tất cả các lệnh \n !ngu: Check xem mình có bị ngu không\n !thi: Xem Thông Tin Thi \n !random a b : số ngẫu nhiên từ a đến b ví dụ !random 1 2\n !tkb: Xem Thời Khóa Biểu\n !trabai: Xem Ai Bị Trả Bài\n !diem: Dự Đoán Điểm Thi Đại Học\n !link: lấy link ảnh\n !covid: Thông tin covid tại VN\n !SDT: Số Thầy Thái\n!s [TEXT]:chat với simsimi', message.threadID);

		}
		else if(command == "ngu"){
		
			randomnumber = Math.floor(Math.random() * 2) + 1;
			let name = '';
			api.getUserInfo(idSender,(err,x)=>
			{
			name = x[idSender].name;
			console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
			if (randomnumber === 1) api.sendMessage(name + ' Ngu như chó', message.threadID);
    		if (randomnumber === 2) api.sendMessage(name + ' không ngu nha! ', message.threadID);
			});
		}

		else if(command == "covid"){
			let name = '';
		api.getUserInfo(idSender,(err,x)=>
		{
		name = x[idSender].name;
		console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
		});
	
       fetch('https://corona.lmao.ninja/v2/countries/vn')
       .then((response) => {
       return (response.json());
       })
       .then((data) => {
       var updateddate = moment(data.updated).locale('vi').tz('Asia/Saigon').format("dddd,Do MMMM YYYY, HH:mm:ss");
        if (data.todayCases < 0) var chuakhoi = (' ( Giảm ' + -data.todayCases + ' ca )')
       else var chuakhoi = (' ( Tăng ' + data.todayCases + ' ca )')
	   var tuvong = data.deaths/data.cases*100;
	   var dichcovid =  'Tại Việt Nam \r\n  + Số Ca Nhiễm: ' + data.cases  + '\r\n  + Đang Điều Trị: ' + data.active  +'\r\n  + Hồi Phục: ' + data.recovered + '\r\n  + Tử Vong: ' + data.deaths + '\r\nUpdated: ' + updateddate ;
       api.sendMessage(dichcovid,message.threadID);  
         })
	 

		}
		else if(command == "random"){
			let name = '';
		api.getUserInfo(idSender,(err,x)=>
		{
		name = x[idSender].name;
		console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
		});
    		if (args[1])
        {
         if (args[2])
         { 
           var a=Number(args[1]);
           var b=Number(args[2]);
           if ((a === 'NaN')  || (a%1 !== 0 ))   api.sendMessage("*SỐ ĐẦU KHÔNG HỢP LỆ", message.threadID)
           else if ((b === 'NaN') || (b%1 !== 0 ))    api.sendMessage("SỐ ĐUÔI KHÔNG HỢP LỆ", message.threadID)
           else if (a>b)             api.sendMessage("SỐ ĐẦU KHÔNG ĐƯỢC PHÉP LỚN HƠN SỐ ĐUÔI:", message.threadID)
           else
           {
            randomnumber = Math.floor(Math.random() * (b - a + 1)) + a;
			api.sendMessage
			("Number: "+randomnumber, message.threadID);
           }
           
         }
      else 
         {
          api.sendMessage("SAI CÚ PHÁP", message.threadID);
          api.sendMessage(" *!RANDOM [Số Đầu] [Số Đuôi]", message.threadID);
         }
        }
        else 
        {
		api.sendMessage("SAI CÚ PHÁP", message.threadID);
		api.sendMessage(" *!RANDOM [Số Đầu] [Số Đuôi]", message.threadID);
	   
        }  
		}
		else if(command == "tkb"){
			let name = '';
		api.getUserInfo(idSender,(err,x)=>
		{
		name = x[idSender].name;
		console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
		});
		var tkb =
		{  body: " Thời Khóa Biểu Nè !",
		   attachment: fs.createReadStream(__dirname + '/tkb.jpg')
		}
		api.sendMessage(tkb, message.threadID);	
		}
		else if (command === "s")
        {
			let name = '';
			api.getUserInfo(idSender,(err,x)=>
			{
			name = x[idSender].name;
			console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
			});
			 
			if (!args[1]) return  api.sendMessage('Mày nói gì tao chã hiểu', message.threadID);
			content = tin.slice(config.prefix.length).trim();
			messagesend =content.slice(2, content.length).trim();
			encodeurl = "https://simsumi.herokuapp.com/api?text=" + encodeURIComponent(messagesend) + "&lang=vi";
		   fetch (encodeurl).then((response) => {
			 return (response.json());
		   }).then((data) => {
			 if (!data.success) return api.sendMessage('Mày nói gì tao chã hiểu', message.threadID );
			 messsagereply = data.success;
			 api.sendMessage(messsagereply, message.threadID);
		   });
		}
		else if(command == "link"){
			let name = '';
		api.getUserInfo(idSender,(err,x)=>
		{
		name = x[idSender].name;
		console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
		});
	    var Linkanh = 'https://bom.to/2lZ7bW';
		api.sendMessage('Link ảnh đây \n'+ Linkanh, message.threadID);	
		}
		else if(command == "sdt"){
			let name = '';
		api.getUserInfo(idSender,(err,x)=>
		{
		name = x[idSender].name;
		console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
		});
	    var Linkanh = 'https://bom.to/2lZ7bW';
		api.sendMessage('Số điện thoại thầy Thái: 0906844294', message.threadID);	
		}
		else if(command == "time"){
			let name = '';
		api.getUserInfo(idSender,(err,x)=>
		{
		name = x[idSender].name;
		console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
		});
				var d = new Date();
				var minutenow= d.getMinutes();
				var hournow = d.getHours();
				var datenow = d.getDate();
				var monthnow = d.getMonth()+1;
				var yearnow = d.getFullYear();
				var timenow =(hournow + ':' + minutenow + ' Ngày ' + datenow + '/' + monthnow + '/' + yearnow);
				api.sendMessage(timenow, message.threadID);
			
		}
		else if(command == "diem"){
			api.getUserInfo(idSender,(err,x)=>
		{
		name = x[idSender].name;
		console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
		}); 
			var name = '';
			var randomnumber = Math.floor(Math.random() * 5) +1;
			if (randomnumber === 1 ) randomnumber = Math.floor(Math.random() * 6) +10;
			if (randomnumber === 2 ) randomnumber = Math.floor(Math.random() * 4) +16;
			if ((randomnumber === 3) || (randomnumber === 4) ) randomnumber = Math.floor(Math.random() *5) +20;
			if (randomnumber === 5)  randomnumber = Math.floor(Math.random() *6) +25;
		api.getUserInfo(idSender,(err,x)=>
		{
		name = x[idSender].name;
		console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
		api.sendMessage(name + ' sẽ thi Đại Học được: ' + randomnumber + ' Điểm' ,message.threadID)
		     });
		
  
		}
		else if(command == "trabai"){
			api.getUserInfo(idSender,(err,x)=>
		{
		name = x[idSender].name;
		console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
		}); 
		var name = '';
		api.sendTypingIndicator(message.threadID);
		let idMember = Object.keys(group[idGroup]);
		api.sendMessage(idMember, message.threadID);
		var a = 0;
		var amax= 0;
		var idlist =  '';

		idMember.map(data=>{
			if(typeof data != "undefined" && data != "undefined"){
			idlist += data + '%';
			amax= a;
			a = a +1;	
			}});
			const id = idlist.trim().split('%');
   
			randomid = Math.floor(Math.random() * (amax + 1)) ;
		
			api.getUserInfo( id[randomid], (err, x) => 
			{
				if(err) return console.error(err);
				var randomreply = Math.floor(Math.random() * 4) ;
				
				name = x[id[randomid]].name;
				if (randomreply === 0)
					api.sendMessage({
				body: '@' +name + ' Sẽ Bị Trả Bài :>>',
				mentions: [{
					 tag: '@' +name,
					 id: id[randomid],
					 fromIndex: 0,
				}],
			}, message.threadID);
			if (randomreply === 1)
					api.sendMessage({
				body: '@' +name + ' đừng tự tử vì bị trả bài nha',
				mentions: [{
					 tag: '@' +name,
					 id: id[randomid],
					 fromIndex: 0,
				}],
			}, message.threadID);
			if (randomreply === 2)
					api.sendMessage({
				body: 'Người may mắn được trả bài sẽ là ' + '@' +name ,
				mentions: [{
					 tag: '@' +name,
					 id: id[randomid],
					 fromIndex: 0,
				}],
			}, message.threadID);
			if (randomreply === 3)
					api.sendMessage({
				body: 'Mai Thầy/Cô Kêu'+  '@' +name + ' Chắc rồi ^^',
				mentions: [{
					 tag: '@' +name,
					 id: id[randomid],
					 fromIndex: 0,
				}],
			}, message.threadID);
			});

		}
        else if(command == "thi"){
			let name = '';
		api.getUserInfo(idSender,(err,x)=>
		{
		name = x[idSender].name;
		console.log( '(GroupID:'+ idGroup + ') ' + name + " đã gủi lệnh " + tin );
		});
			var d = new Date();
			var datenow = d.getDate();
			var monthnow = d.getMonth();
			var yearnow = d.getFullYear();
			var daynow =(yearnow + ', ' + monthnow + ', ' +datenow );
			var now = new Date(daynow);
			var ngaythidaihoc = new Date('2020, 7, 9');
			var offset = ngaythidaihoc.getTime() - now.getTime(); 
			var songaythidh = Math.round(offset / 1000 / 60 / 60 / 24);
			var ngaythidgnl = new Date('2020, 7, 17');
			var offset = ngaythidgnl.getTime() - now.getTime(); 
			var songaythidgnl = Math.round(offset / 1000 / 60 / 60 / 24);
			api.sendMessage('Thời Gian Thi THPTQG ( Còn '+  songaythidh  +  ' Ngày ):\r\n - 09/08/2020: + Sáng:  Thi Ngữ Văn(120p)   Phát Đề: 7h30  --- Tính Giờ Làm Bài: 7h35 \r\n  + Chiều: Thi Toán(90p)       Phát Đề: 14h20 --- Tính Giờ Làm Bài: 14h30 \r\n \r\n - 10/08/2020: + Sáng:  Thi Vật Lý(120p)    Phát Đề: 7h30  --- Tính Giờ Làm Bài: 7h35\r\n    Thi Hóa Học(50p)    Phát Đề: 8h30  --- Tính Giờ Làm Bài: 8h35\r\n     Thi Sinh Học(50p)   Phát Đề: 9h30  --- Tính Giờ Làm Bài: 9h35\r\n        + Chiều: Thi Anh Văn(60p)    Phát Đề: 14h20 --- Tính Giờ Làm Bài: 14h30', message.threadID);
			api.sendMessage('Thời Gian Thi ĐGNL   (Còn ' + songaythidgnl + ' Ngày ): \r\n - 16/08/2020: Thi Tại Bến Tre', message.threadID);
			
		}

    	else{
	    	if(typeof group[idGroup] == "undefined"){
	    		group[idGroup] = {};
	    		level[idGroup] = {};
	    	}

	    	if(typeof group[idGroup][idSender] == "undefined"){
	    		group[idGroup] = {};
	    		level[idGroup] = {};
	    		group[idGroup][idSender] = 0;
	    		level[idGroup][idSender] = 0;
	    	}
	    	else {
	    		group[idGroup][idSender]++;
	    		level[idGroup][idSender] = group[idGroup][idSender] / 100 + 1;
	    	}

	    	
    	}
        //api.sendMessage(message.body, message.threadID);
    });
});
