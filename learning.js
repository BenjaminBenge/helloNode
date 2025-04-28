let order = ( time, work ) => {

  return new Promise( ( resolve, reject )=>{

    if( is_shop_open ){

      
      setTimeout(()=>{

        // work is 👇 getting done here
         resolve( work() )
 
 // Setting 👇 time here for 1 work
        }, time)

    }

    else{

      reject( console.log("Our shop is closed") )

    }

  })
}

let production = () =>{

  setTimeout(()=>{
    console.log("production has started")
  },1000)

};



