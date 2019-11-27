if(process.env.NODE_ENV=="production"){
    module.exports={mongoURI: "mongodb+srv://renatosb:renato@cluster0-jnbzm.mongodb.net/test?retryWrites=true&w=majority"}
    console.log("conectado na web")
}else{
    var ambiente = process.env.NODE_ENV
    console.log("conectado em " . ambiente)
    module.exports={mongoURI: "mongodb://localhost/blogapp"}
//    module.exports={mongoURI: "mongodb+srv://renatosb:renato@cluster0-jnbzm.mongodb.net/test?retryWrites=true&w=majority"}
    
}


// mongodb+srv://renatosb:<password>@cluster0-jnbzm.mongodb.net/test?retryWrites=true&w=majority