import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

function bBox(n){
  if(n == 0){ return 1;}
  if(n == 1){ return 18;}
  if(n == 2){ return 243;}
  if(n > 2){
   n = 12 * bBox(n - 1) + 18 * bBox(n - 2);
  }
  return n;
}

// ===========================
app.get("/", (req, res) => {
  let result = "";
  if(!isNaN(req.query.i)){
    result = bBox(parseInt(req.query.i));
  }
  res.json(result);
});

app.listen(3000, () => {
  console.log('================= SKB Task2X listening on port 3000!');
});
