import Image from "next/image";

type LeadershipCardProps = {
  name: string;
  title: string;
  img: string;
  icon: string;
};

export default function OurLeaderCards({
  name,
  title,
  img,
  icon,
}: LeadershipCardProps) {
  return (
    <div
      className="rounded-xl bg-custom-white shadow relative flex py-2
     flex-col items-center border border-custom-gray/20"
    >
      <div className="relative w-[90px] h-[90px] rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={img}
          alt={name}
          fill
          className="object-cover"
          sizes="90px"
        />
      </div>

      <div className="mt-3 flex flex-col items-center ">
        <div className="flex flex-col items-center">
          <h3 className="font-semibold text-lg mt-2">{name}</h3>
          <p className="text-[18px] text-custom-teal font-medium mb-2">{title}</p>
        </div>
        <div
          className="bg-custom-teal absolute top-21
         rounded-full p-1 "
        >
          <Image src={icon} alt="icon" width={14} height={14} />
        </div>
      </div>
    </div>
  );
}
