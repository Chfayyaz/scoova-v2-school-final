import Image from "next/image";

type SchoolInfoHeaderProps = {
  name: string;
  location: string;
  principalName: string;
  profileImage: string | null;
};

const FALLBACK_LOGO = "/images/GreenwoodAcademyLogo.png";

export default function SchoolInfoHeader({
  name,
  location,
  principalName,
  profileImage,
}: SchoolInfoHeaderProps) {
  const logoSrc = profileImage?.trim() ? profileImage : FALLBACK_LOGO;

  return (
    <div className="bg-custom-white rounded-lg mb-4 px-4 py-3 sm:py-6 border border-custom-gray/10 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/images/Image(1).png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="sm:flex items-center gap-4 relative z-10">
        <div className="shrink-0 rounded-lg overflow-hidden inline-block bg-custom-white/80 border border-custom-gray/10">
          <Image
            src={logoSrc}
            alt={`${name} logo`}
            width={60}
            height={60}
            className="w-[60px] h-[60px] object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-[24px] font-bold text-custom-gray/95 truncate">{name}</h1>
          <p className="text-[16px] text-custom-gray/90">{location}</p>
          <p className="text-[16px] text-custom-gray/70">Principal: {principalName}</p>
        </div>
      </div>
    </div>
  );
}
