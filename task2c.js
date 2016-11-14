import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

// For task2C: @username
app.get('/', (req, res) => {
  res.send(getUsername(req.query.username));
});

function getUsername(url){
	const regexp = new RegExp('^(https?\:)?(\/\/)?(([a-z]+)[^\/]*\/)?(([a-z]+)[^\/]*\/)?(.\+)?([^\/]*\/)?$');
		

	if(url[0] == "@"){
		return url;
	}

	const username = url.match(regexp);

	
	//return username;
	if(username[5] == null){
		return "@" + username[7];	
	}
	return "@" + username[5].slice(0,-1);
}

app.listen(3000, () => {
  console.log('Hello JS Task2C listening on port 3000!');
});
