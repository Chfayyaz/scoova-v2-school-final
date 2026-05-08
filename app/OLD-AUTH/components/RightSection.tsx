import Image from "next/image";

type RightSectionProps = {
  title?: string;
  description?: string;
};



const RightSection = ({ title = "Welcome Back, School Admin 👋", description = "Access your school dashboard and continue managing your community" }: RightSectionProps = {}) => {
  return (
    <div className="bg-custom-teal h-screen relative">
      <div
        className="absolute top-0 right-0 w-[64%] h-[95%] bg-no-repeat"
        style={{
          backgroundImage: "url('/images/bg-Ellipse.png')",
          backgroundPosition: "top right",
          backgroundSize: "contain",
        }}
      />

      <div className="pt-8">
        <div className="flex items-center gap-1 justify-center">
          <Image
            src="/images/MdOutlineSupportAgent.png"
            alt="Help Circle"
            width={30}
            height={30}
          />
          <p className="text-custom-white/60 relative z-50">Support</p>
        </div>

        <div className="relative z-50 flex justify-center mt-12">
          <Image
            src="/images/svg/Overview.svg"
            width={500}
            height={500}
            alt="img"
            className="z-100 lg:w-[80%] md:w-[90%] w-[80%]"
          />
        </div>

        <div className=" mx-auto text-center">
          <h1 className="text-custom-white relative mt-10 text-xl font-semibold md:text-[28px] lg:text-[35px]">
            {title}
          </h1>
          <p className="text-[20px]  w-[70%] mx-auto relative   text-custom-white/60">
            {description}
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default RightSection;
