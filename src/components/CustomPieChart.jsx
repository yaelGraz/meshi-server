
import React, { useState } from "react";
import { PieChart, Pie, Cell, Sector } from "recharts";

const initialData = [
  { name: "Part 1", value: 25 },
  { name: "Part 2", value: 25 },
  { name: "Part 3", value: 25 },
  { name: "Part 4", value: 25 },
];
      
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF19AF",
];

const COLORSDATA=[
  "red",
  "blue",
  "pink",
  "#AF19FF"
]
const CustomPieChart = () => {
  const [data, setData] = useState(initialData);
  const [activeIndex, setActiveIndex] = useState(null);

  // const onPieClick = (clickedData, index) =>
  //  {
  //   if (activeIndex === index) 
  //   {
  //     setActiveIndex(null);

  //   //new
  //     const newData = [...data];
  //     // Reset the clicked part to its original value
  //     newData[index].value = initialData[index].value;
  //     setData(newData);
  //   } 
  //   else {
  //     const newData = [...data];
  //     const newValue = newData[index].value / 4;

  //     newData[index].value = newValue;

  //     for (let i = 1; i <= 3; i++) {
  //       newData.splice(index + i, 0, { name: `Part ${index + i + 1}`, value: newValue });
  //     }

  //     setActiveIndex(index);
  //     setData(newData);
     
  //   }
  // const onPieClick = (clickedData, index) => {
  //   if (activeIndex === index) {
  //     setActiveIndex(null);
  //   } else {
  //     const newData = data.map((item, i) => {
  //       if (i === index) {
  //         const newValue = item.value / 4;
  //         return { name: `Part ${i + 1}`, value: newValue };
  //       } else {
  //         return item;
  //       }
  //     });
  
  //     const dividedParts = [];
  //     for (let i = 0; i < 3; i++) {
  //       dividedParts.push({ name: `Part ${index + i + 2}`, value: newData[index].value });
  //     }
  
  //     newData.splice(index + 1, 0, ...dividedParts);
  //     setActiveIndex(index);
  //     setData(newData);
  //   }
  // };

  // const onPieClick = (clickedData, index) => 
  // {
  //   if (activeIndex === index) {
  //     setActiveIndex(null);
  //   } else {
  //     const originalValue = data[index].value;
  //     const newValue = originalValue / 4;
  
  //     const newData = data.map((item, i) => {
  //       if (i === index) {
  //         return { ...item, value: originalValue - (3 * newValue) };
  //       } else {
  //         return { ...item, value: newValue };
  //       }
  //     });
  
  //     setActiveIndex(index);
  //     setData(newData);
  //   }
  // };

  const onPieClick = (clickedData, index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      const originalValue = data[index].value;
      const newValue = originalValue / 4;
  
      const newData = data.map((item, i) => {
        if (i === index) {
          return { ...item, value: originalValue - (3 * newValue) };
        } else if (item.value !== newValue) {
          return { ...item, value: newValue };  
        }
        return item;
      });
  
      setActiveIndex(index);
      setData(newData);
    }
  };
  
    
  // };


  return (
    <PieChart width={4000} height={4000}>
      <Pie
        activeIndex={activeIndex}
        activeShape={({ cx, cy, innerRadius, outerRadius, startAngle, endAngle }) => (
          <g>
            <g>
            <Sector
              cx={cx}
              cy={cy}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={startAngle}
              endAngle={(endAngle - startAngle) / 4 + startAngle}
              fill={COLORS[activeIndex]}
            />
                <text
            x={cx + innerRadius * Math.cos((endAngle - startAngle) / 8 + startAngle)}
            y={cy + innerRadius * Math.sin((endAngle - startAngle) / 8 + startAngle)}
            dy={8}
            textAnchor="middle"
            fill="#000"
            fontSize={20}
            fontWeight="bold"
            transform={`rotate(${((endAngle - startAngle) / 8 + startAngle) * (180 / Math.PI)}, ${cx}, ${cy})`}
          >
            מילים יפות!!!!!!!!
          </text>
        </g>
        <g>
            <Sector
              cx={cx}
              cy={cy}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={(endAngle - startAngle) / 4 + startAngle}
              endAngle={(endAngle - startAngle) / 2 + startAngle}
              fill={COLORS[(activeIndex + 1) % COLORS.length]}
            />
                  <text
         x={cx + innerRadius * Math.cos((endAngle - startAngle)*3 / 8 + startAngle)}
         y={cy + innerRadius * Math.sin((endAngle - startAngle)*3 / 8 + startAngle)}
            dy={8}
            textAnchor="middle"
            fill="#000"
            fontSize={12}
            fontWeight="bold"
            transform={`rotate(${((endAngle - startAngle)*3 / 8 + startAngle) * (180 / Math.PI)}, ${cx}, ${cy})`}
          >
            מילים יפות!!!!!!!!
          </text>
        </g>
        <g>
            <Sector
              cx={cx}
              cy={cy}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={(endAngle - startAngle) / 2 + startAngle}
              endAngle={(endAngle - startAngle) * 3 / 4 + startAngle}
              fill={COLORS[(activeIndex + 2) % COLORS.length]}
            />
                  <text
       x={cx + innerRadius * Math.cos((endAngle - startAngle)*5 / 8 + startAngle)}
       y={cy + innerRadius * Math.sin((endAngle - startAngle)*5 / 8 + startAngle)}
            dy={8}
            textAnchor="middle"
            fill="#000"
            fontSize={12}
            fontWeight="bold"
            transform={`rotate(${((endAngle - startAngle) *5/ 8 + startAngle) * (180 / Math.PI)}, ${cx}, ${cy})`}
          >
            מילים יפות!!!!!!!!
          </text>
        </g>
             <g>
            <Sector
              cx={cx}
              cy={cy}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={(endAngle - startAngle) * 3 / 4 + startAngle}
              endAngle={endAngle}
              fill={COLORS[(activeIndex + 3) % COLORS.length]}
            />
                  <text
          x={cx + innerRadius * Math.cos((endAngle - startAngle)*7 / 8 + startAngle)}
          y={cy + innerRadius * Math.sin((endAngle - startAngle)*7 / 8 + startAngle)}
            dy={8}
            textAnchor="middle"
            fill="#000"
            fontSize={12}
            fontWeight="bold"
            transform={`rotate(${((endAngle - startAngle)*7 / 8 + startAngle) * (180 / Math.PI)}, ${cx}, ${cy})`}
          >
            מילים יפות!!!!!!!!
          </text>
        </g>
          </g>
        )}
        data={data}
        dataKey="value"
        cx={200}
        cy={200}
        outerRadius={200}
        fill="#8884d8"
        onClick={onPieClick}
      >
        {data.map((entry, index) => (
           
          <Cell key={`cell-${index}`} fill={COLORSDATA[index % COLORSDATA.length] } />
    
        ))}
      </Pie>
    </PieChart>
   
    // {part!==null && <Succeeded part={part}></Succeeded>}
 
    
  );
};

export default CustomPieChart;
