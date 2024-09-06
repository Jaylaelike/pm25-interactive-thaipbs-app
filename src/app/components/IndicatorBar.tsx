function IndicatorBar() {
    return (
      <div>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="grid grid-cols-5 w-full max-w-4xl h-6 rounded-full my-2 p-4">
            <span className=" text-center px-4 py-2 rounded-l-full bg-blue-500 text-white">{`ด\u{e35}มาก`}</span>
            <span className=" text-center px-4 py-2 bg-green-500 text-white">{`ด\u{e35}`}</span>
            <span className=" text-center px-4 py-2 bg-yellow-500 text-white">
              ปานกลาง
            </span>
            <span className=" text-center px-4 py-2 bg-orange-500 text-white">
              {`เร\u{e34}\u{e48}มม\u{e35}ผลกระทบต\u{e48}อส\u{e38}ขภาพ`}
            </span>
            <span className="  text-center px-4 py-2 rounded-r-full bg-red-500 text-white">{`ม\u{e35}ผลกระทบต\u{e48}อส\u{e38}ขภาพ`}</span>
          </div>
        </div>
      </div>
    );
  }
  
  export default IndicatorBar;
  