import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

let pc = {};

function getPc(pcUrl = "https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json"){
  fetch(pcUrl)
	  .then(async (res) => {
	  pc = await res.json();
  })
	  .catch(err => {
	  console.log('Error load json data:', err);
  });
  return pc;
}

function getVolumes(hdd){
	let volumes = {};
	hdd.forEach( function(item, index, hdd){
		if(item.volume in volumes){
			volumes[item.volume] = volumes[item.volume] + item.size;
		}else{
			volumes[item.volume] = item.size;
		}
	});

	for(var item in volumes){
		volumes[item] = volumes[item] + "B";
	}
	return volumes;
}

function getComponent(path, pc){
	let pcComponent = {};
	const notFound = "Not Found";
  console.log(path.length);

if( path[1] == "length" ){  return notFound; }

if(path.length > 1){

  path.forEach( function(item, index){
		pcComponent = notFound;
		if(item){
      pcComponent = pc[item];
      if(typeof pc[item] !== "undefined"){
        pcComponent = getComponent(path.splice(1), pc[item]);
      }
		}
    if(pcComponent == notFound){
      return notFound;
    }
	});

}else{
  pcComponent = pc[path];
}

 if(typeof pcComponent == "undefined"){
	pcComponent = notFound;
 }

	return pcComponent;
}

function getPatharray(url){
	let pathArray = [];
	url = url.replace(/\/{2,}/g,'/');
	pathArray = url.split("/");
  if(pathArray[pathArray.length-1] == ""){
    pathArray.pop();
  }
	return pathArray.splice(1);
}


// For task3A: API
pc = getPc();

app.get("/volumes", (req, res) => {
	res.json( getVolumes( pc.hdd ) );
});

app.get("/", (req, res) => {
	res.json(pc);;
});

app.get("/*", (req, res) => {
	let pcComponent = getComponent( getPatharray( req.url ), pc );
	if( pcComponent == "Not Found"){
		res.status(404);
		res.send("Not Found");
	}
	res.json(pcComponent);
});

app.listen(3000, () => {
  console.log('Task3A listening on port 3000!');
});
