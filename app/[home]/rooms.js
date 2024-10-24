"use client";

export default function Rooms({ chatInfos }) {
  if (!chatInfos.length)
    return <div className="hidden lg:w-1/6 lg:flex xl:w-36 px-4 " />;

  return (
    <div className=" hidden lg:w-1/6 lg:flex xl:w-36 px-4 flex-col">
      <div className="py-4 text-neutral-600 h-fit">Rooms</div>
      <div className="h-fit overflow-auto ">
        {chatInfos.map((chatInfo, index) => (
          <div key={index}>{chatInfo.rooms}</div>
        ))}
      </div>
    </div>
  );
}
