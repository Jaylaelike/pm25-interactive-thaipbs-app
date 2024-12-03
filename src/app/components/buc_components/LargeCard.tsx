interface LargeCardProps {
    title: string;
    num: number;
    desc: string;
    bgColors: string;
    children?: React.ReactNode;
}

import ReactSpeedometer from "react-d3-speedometer"

  
  const LargeCard: React.FC<LargeCardProps> = ({
    title,
    num,
    desc,
    bgColors,
    children,
  }) => {
    return (
      <div className={`${bgColors} py-7 px-10 flex flex-col items-center justify-between space-y-4 rounded-lg`}>
        <p>{title}</p>
        
         <ReactSpeedometer
              height={200}
              width={200}
              maxValue={80}
              value={Number(num.toFixed(2))}
              needleColor="black"
              startColor="green"
              needleTransitionDuration={4000}
              needleTransition="easeElastic"
              ringWidth={15}
              segments={5}
              endColor="red"
            />

        <h2 className="text-6xl font-bold">
          {num}
          <span className="text-4xl font-normal">{desc}</span>
        </h2>
      
        {children}
      </div>
    );
  };
  
  export default LargeCard;
  