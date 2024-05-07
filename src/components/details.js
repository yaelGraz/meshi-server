
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PieChart2 from "./PieChart2";

function Details(){
    const { cat,id } = useParams();
   
    
    return(  
        <>          
          <h1 >Details of category {cat} subCategory {id}</h1>
          {/* <PieChart2 active={cat} style={{display:'block'}} position={{cx:100,cy:80,outerRadius:70}}></PieChart2> */}
       </>      
       
    );
    
}

export default Details;


