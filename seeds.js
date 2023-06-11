var mongoose = require("mongoose")

var coffee = require("./models/coffee");

var url = process.env.DATABASEURL||"mongodb://localhost/coffilicious"

mongoose.connect(url,{
	useNewUrlParser: true, 
	useUnifiedTopology: true,
	useCreateIndex: true,
	 useFindAndModify: false
 })

const db = mongoose.connection

db.on("error", console.error.bind(console,"Connection error"))
db.once("open",()=>{
    console.log("Connection successful")
})

const seedDB = async () => {
    await coffee.deleteMany({})
    const c1 = new coffee({
        name:"Cappucino",
        image: "https://images.unsplash.com/photo-1594261956806-3ad03785c9b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2FwcHVjaW5vfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
        price: 20,
        desc:"Amazing cappucino",
    })
    
    c1.save()
    
    const c2 = new coffee({
        name:"Black Coffee",
        image: "https://images.unsplash.com/photo-1613336026275-d6d473084e85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8YmxhY2slMjBjb2ZmZWV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        price: 8,
        desc:"Amazing Black Coffee",
    })
    
    c2.save()
    
    const c3 = new coffee({
        name:"Espresso",
        image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8ZXNwcmVzc298ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
        price: 15,
        desc:"Amazing Espresso",
    })
    
    c3.save()

    const c4 = new coffee({
        name:"Latte",
        image: "https://images.unsplash.com/photo-1571658734974-e513dfb8b86b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGxhdHRlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=2000&q=60",
        price: 21,
        desc:"Amazing Latte",
    })
    
    c4.save()
}

seedDB();