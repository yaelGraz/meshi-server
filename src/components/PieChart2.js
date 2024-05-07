
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Sector } from "recharts";
import Details from "./details";
import './PieChart2.css';
import RenderActiveShape from "./RenderActiveShape";
import { useNavigate } from "react-router-dom";

const initialData = [
  { name: "Part 1",  value:12.5 ,sectors:6} ,
  { name: "Part 2",  value: 12.5 ,sectors:4},
  { name: "Part 3",  value: 12.5 ,sectors:3} ,
  { name: "Part 4",  value: 12.5 ,sectors:2} ,
  { name: "Part 5",  value: 12.5 ,sectors:6},
  { name: "Part 6",  value: 12.5 ,sectors:5},
  { name: "Part 7",  value: 12.5 ,sectors:3} ,
  { name: "Part 8",  value: 12.5 ,sectors:3} ,

];
      
const COLORS = [
  "rgba(255,0,0,1)",
  "rgba(255,0,0,0.8)",
  "rgba(255,0,0,0.6)",
  "rgba(255,0,0,0.4)",
  "rgba(255,0,0,0.2)",
  "rgba(255,0,0,0.1)",
];

const COLORSDATA=[
  "rgb(255,0,0)",
  "rgb(255, 128, 0)",
  "rgb(255, 255, 0)",
  "rgb(0, 255, 0)",
  "rgb(0, 255, 255)",
  "rgb(255, 0, 128)",
  "rgb(0, 0, 255)",
  "rgb(128, 0, 255)"
]

const PieChart2 = ({active,style}) => {
  const [data, setData] = useState(initialData);
  const [activeIndex, setActiveIndex] = useState(null);
  const [part,setPart]=useState(null);
  const [subSectorCount, setSubSectorCount] = useState(1);
  const [sectors,setSectors]=useState([]);
  const [angleUnit,setAngleUnit]=useState(0);
  const[pieStyle,setPieStyle]=useState(style);
  const[position,setPosition]=useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate=useNavigate();

  
useEffect(()=>{
  if(active!==undefined){
    console.log("act ",active)
    setActiveIndex(active)
  }
},[])

  useEffect(()=>{
     console.log("sectors[]: ",sectors)
  },[sectors])
 
useEffect(()=>{
   
    if(activeIndex!==null){
      console.log("data[activeIndex].sectors ",data[activeIndex].sectors)
      setSectors(Array.from({ length: data[activeIndex].sectors }, (key, index) => ({
       key: `sector-${index}`
     })))
    }
   
  },[angleUnit,data,activeIndex])
 
  useEffect(()=>{
    setAngleUnit(360/data.length/subSectorCount)
  },[subSectorCount,data])

  useEffect(()=>{
    if(activeIndex!==null)
       setSubSectorCount(data[activeIndex].sectors)
  },[activeIndex,data])

  // הפונקציה לשינוי צבע במערך
  const changeColorAtIndex=(index) =>{
    var color = COLORSDATA[index];
    var newAlpha=1;
    var parts = color.match(/(\d+(?:\.\d+)?)/g);
   
      var r = parts[0];
      var g = parts[1];
      var b = parts[2];
      for(var i=0;i<COLORS.length;i++){
        COLORS[i] = `rgba(${r},${g},${b},${newAlpha-=0.15})`;
    }
  
  }

  const onPieClick = (clickedData, index) => {
    
    changeColorAtIndex(index);
 
    const originalValue = data[index].value;
    const newValue = originalValue / 6;
  
    const newData = data.map((item, i) => {
      // if (i === index) {
        return { ...item, value: newValue };
      // }
      // return item;
    });

      setActiveIndex(index);
     // Update the data w ith the new values
      setData(newData);
      // renderSectors();
     
  };

  
  // const renderSectors = () => {
  //   if (activeIndex === null) {
  //     return null;
  //   }

  //   const clickedSlice = data[activeIndex];
  //   const totalAngle = clickedSlice.endAngle - clickedSlice.startAngle;
  //   const numSectors = 4; // Adjust as needed

  //   const angleUnit = totalAngle / numSectors;

  //   return Array.from({ length: numSectors }).map((_, i) => (
  //     <Sector
  //       key={`sector-${i}`}
  //       cx={630}
  //       cy={200}
  //       innerRadius={0} // set the innerRadius as needed
  //       outerRadius={200}
  //       startAngle={clickedSlice.startAngle + i * angleUnit}
  //       endAngle={clickedSlice.startAngle + (i + 1) * angleUnit}
  //       fill={COLORS[i % COLORS.length]}
  //       onClick= {(navigate(`/details/${activeIndex}/${i}`))}
        
  //     />
  //   ));
  // };

  const handleSectorClick=(i)=>{
    setPieStyle({display:'block'})
    setPosition({cx:100,cy:70,outerRadius:70})
   
    setShowDetails(true);
    // console.log("show",showDetails)
    // navigate(`/details/${activeIndex}/${i}`);
     
  }


  return (
  <div style={pieStyle}>
   
    <PieChart className="recharts-wrapper" width={4000} height={4000} margin={400}>
      <Pie  
        activeIndex={activeIndex}
        data={data}
        dataKey="value"
        cx={position?.cx||630}
        cy={position?.cy||200}
        outerRadius={position?.outerRadius||200}
        
        activeShape={({cx, cy, innerRadius, outerRadius, startAngle, endAngle})=>(
             sectors.map((entry, i)=>{
              return (
                <Sector
                  key={entry.key}
                  cx={cx}
                  cy={cy}
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  startAngle={startAngle + i * angleUnit}
                  endAngle={startAngle + (i + 1) * angleUnit}
                  fill={COLORS[i]}
                  onClick={(i) =>{handleSectorClick(i)}}
                >
                </Sector>
             )
            }
          )
        )}


        onClick={(clickedData, index) => onPieClick(clickedData, index)}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORSDATA[index % COLORSDATA.length] } />
        ))}
        
      </Pie>
    </PieChart>

 {showDetails&&console.log("position",position)}
    {showDetails &&(
        <div className="details-container">
          <Details cat={activeIndex} id={activeIndex} />
        </div>)}
     
    </div>
  );
};

export default PieChart2;




























