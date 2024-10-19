"use client";

export default function Members({ members }) {
  if (!members.length) return;

  return (
    <div className=" hidden lg:w-1/6 lg:flex xl:w-36 px-4 flex-col">
      <div className="py-4 text-neutral-600 h-fit">Participants</div>
      <div className="h-fit overflow-auto ">
        {members.map((member, index) => (
          <div key={index}>{member}</div>
        ))}
      </div>
    </div>
  );
}
