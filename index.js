import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.get('/', (req, res) => {
  res.json({
    hello: 'JS World',
  });
});

app.get('/task2A', (req, res) => {
  res.send( add(req.query.a, req.query.b).toString() );
});

function add(a, b){
	if(isNaN(a)){
		a = 0;
	}
	if(isNaN(b)){
		b = 0;
	}	
	
	return 	parseInt(a) + parseInt(b);;
}

app.listen(3000, () => {
  console.log('Hello JS Task2A listening on port 3000!');
});
