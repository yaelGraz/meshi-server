import React, { useState } from "react";
import { Sector } from "recharts";

function RenderActiveShape(sectorData,sectors,angleUnit,COLORS){
   const {cx, cy, innerRadius, outerRadius, startAngle, endAngle }=sectorData;
   const sectorArray=[sectors];
    return(
       <g>
           {sectors.map((entry,i)=>(
              <Sector>
                  key={`sector-${i}`}
                   cx={cx}
                   cy={cy}
                   innerRadius={innerRadius}
                   outerRadius={outerRadius}
                   startAngle={startAngle + i * angleUnit}
                   endAngle={startAngle + (i + 1) * angleUnit}
                   fill={COLORS[i % COLORS.length]}
              </Sector>
           ))}
     </g>
    );
}

export default RenderActiveShape;