
	const mysql = require('mysql');
	const config = {
		host: "localhost",
		user: "root",
		password: "PALEsedem1@",
		database:"notes_database"
	  };
	const express = require('express');
	const session = require('express-session');
	
	const app = express();
	app.use(express.static('public'));
	app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
	app.set('view engine', 'ejs');

	let connection = mysql.createConnection(config);
	
	let user = null;

	app.get('/',(req,res)=>{
		res.render('client/index');
	});
	app.get('/login',(req,res)=>{
		res.render('client/login');
	});
	app.get('/register',(req,res)=>{
		res.render('client/register');
	});
	app.get('/user/:username/:password',(req,res) => {

		const query = `CALL select_user('${req.params.username}','${req.params.password}')`;  
		connection.query(query, true, (error, results, fields) => {
			if (error) {
			return console.error(error.message);
			}
			if(typeof(results[0][0]) === undefined){
				console.log('123123');
				res.send('error');
			}else {
				req.session.user = results[0][0];
				console.log(typeof(results[0][0])=='undefined');
				res.send('/user');
			}
		});


	})
	app.post('/user/:username/:password',(req,res) => {
		const query = `CALL insert_user('${req.params.username}','${req.params.password}')`;  
		connection.query(query, true, (error, results, fields) => {
			if (error) {
				res.send('error')
				return console.error(error.message);
			}else{
				req.session.user = results[0][0];
				console.log(typeof(results[0][0])=='undefined');
				res.send('/user');
			}
			
			 
				
			
			
			
		});


	})
	app.get('/user',(req,res)=>{
		//.log(user['id']);
		if (req.session && req.session.user) {
			const query1 = `CALL select_task_user(${req.session.user.id})`;
			const query2 = `CALL select_note_id_user(${req.session.user.id})`;
			const query3 = `SELECT * FROM importance ORDER BY id`; 
			let arr = [];
			connection.query(query1, true, (error, results, fields) => {
				if (error) {
					return console.error(error.message);
				}
			 	arr.push(results[0]);
			});
			connection.query(query2, true, (error, results, fields) => {
				if (error) {
					return console.error(error.message);
				}
				arr.push(results[0]);
			});
			connection.query(query3, true, (error, results, fields) => {
				if (error) {
				return console.error(error.message);
				}
				arr.push(results);
				res.render("client/main",{data:arr});
			});
			
			
		
		}else res.redirect('/login');
		

	});
	app.get('/task/:idTask',(req,res)=>{
		let arr = [];
		const query1 = `CALL select_task_id(${req.params.idTask})`;
		const query2 = `CALL select_note_id_task(${req.params.idTask})`; 
		console.log("hi");
		connection.query(query1, true, (error, results, fields) => {
			if (error) {
			return console.error(error.message);
			}
			arr[0]=results[0][0];
			connection.query(query2, true, (error, results, fields) => {
				if (error) {
				return console.error(error.message);
				}
				arr[1]=results[0];
				res.send(arr);
				console.log(req.session.user.id);
			});	
		});

	});
	app.post('/task/:name/:text/:idImportance/:startDate/:endDate',(req, res) =>{
		if (req.session && req.session.user) {
			const query = `CALL insert_task('${req.params.name}','${req.params.text}',${req.params.idImportance},${req.session.user.id},'${req.params.startDate}','${req.params.endDate}')`; 
			connection.query(query, true, (error, results, fields) => {
			if (error) {
			return console.error(error.message);
			}
			res.send();
			console.log(req.session.user.id);
			});
		}else res.redirect('/login');
		
	});
	app.put('/task/:id/:name/:text/:idImportance/:startDate/:endDate',(req, res) =>{
		if (req.session && req.session.user) {
			const query = `CALL update_task(${req.params.id},'${req.params.name}','${req.params.text}',${req.params.idImportance},${req.session.user.id},'${req.params.startDate}','${req.params.endDate}')`; 
			console.log(query);
			connection.query(query, true, (error, results, fields) => {
			if (error) {
			return console.error(error.message);
			}
			res.send();
			console.log(req.session.user.id);
		});
		}else res.redirect('/login');
		
	});
	app.delete('/task/:idTask',(req,res)=>{
		const query = `CALL delete_task(${req.params.idTask})`; 
		connection.query(query, true, (error, results, fields) => {
			if (error) {
			return console.error(error.message);
			}
			res.send();
			console.log(req.session.user.id);
		});
	});
	app.get('/note/:idNote',(req,res)=>{
		const query = `CALL select_note_id(${req.params.idNote})`; 
		connection.query(query, true, (error, results, fields) => {
			if (error) {
			return console.error(error.message);
			}
			res.send(results[0]);
			console.log(req.session.user.id);
		});

	});
	app.post('/note/:name/:text/:idImportance/:idLink/:startDate',(req, res) =>{
		if (req.session && req.session.user) {
			console.log(req.params.idLink);
			const link = req.params.idLink == -1 ? `${req.session.user.id},null` : `null,${req.params.idLink}`;
			const query = `CALL insert_note('${req.params.name}','${req.params.text}',${req.params.idImportance},${link},'${req.params.startDate}')`; 
			connection.query(query, true, (error, results, fields) => {
				if (error) {
				return console.error(error.message);
				}
				res.send();
				console.log(req.session.user.id);
			});
		}else res.redirect('/login');
		
	});
	app.put('/note/:id/:name/:text/:idImportance/:idLink/:startDate',(req, res) =>{
		if (req.session && req.session.user) {
			const link = req.params.idLink == -1 ? `${req.session.user.id},null` : `null,${req.params.idLink}`;
			const query = `CALL update_note(${req.params.id},'${req.params.name}','${req.params.text}',${req.params.idImportance},${link},'${req.params.startDate}')`; 
			console.log(query);
			connection.query(query, true, (error, results, fields) => {
			if (error) {
			return console.error(error.message);
			}
			res.send();
			console.log(req.session.user.id);
			});
		}else res.redirect('/login');
		
	});
	app.delete('/note/:idNote',(req,res)=>{
		const query = `CALL delete_note(${req.params.idNote})`; 
		connection.query(query, true, (error, results, fields) => {
			if (error) {
			return console.error(error.message);
			}
			res.send();
			console.log(req.session.user.id);
		});
	});
	const port = process.env.PORT || 8080;
	app.listen(port, () => console.log(`doing stuff ${port}`));
	//let sql = `SELECT * FROM user`;

	