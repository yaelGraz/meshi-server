import React, { useEffect, useState } from "react";
import service from "../service";

function List({part}){
   
    async function getCategories() {
        const categories = await service.getCategories();
        console.log("categories:",categories)
    }
    useEffect(()=>{
       console.log("use effect")  
       getCategories();
    },[] )

    return(
       <>
         <h1>Look at the console...</h1>
       </>
    );
}

export default List;