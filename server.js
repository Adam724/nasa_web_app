const express = require('express');
const app = express();

//routes
app.get('/', function(request, response){
    response.send('Hello World');
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});