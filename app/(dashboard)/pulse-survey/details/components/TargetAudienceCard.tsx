"use client";

import { Users, User, GraduationCap } from "lucide-react";

type TargetAudienceCardProps = {
  targetAudience: string[];
  totalRecipients: number;
  sent: number;
  pending: number;
};


export const    GraduationCapIcon=()=>(
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.85305 0.0140625C6.94993 -0.0046875 7.04993 -0.0046875 7.1468 0.0140625L13.3968 1.26406C13.7468 1.33281 13.9999 1.64219 13.9999 1.99844C13.9999 2.35469 13.7468 2.66406 13.3968 2.73281L10.9999 3.21406V4.99844C10.9999 7.20781 9.2093 8.99844 6.99993 8.99844C4.79055 8.99844 2.99993 7.20781 2.99993 4.99844V3.21406L1.49993 2.91406V4.94844L1.99055 7.39844C2.01868 7.54531 1.98118 7.69844 1.88743 7.81406C1.79368 7.92969 1.64993 7.99844 1.49993 7.99844H0.499926C0.349926 7.99844 0.209301 7.93281 0.112426 7.81406C0.0155513 7.69531 -0.0219487 7.54531 0.00930126 7.39844L0.499926 4.94844V2.70469C0.203051 2.60156 -7.37386e-05 2.32031 -7.37386e-05 1.99844C-7.37386e-05 1.64219 0.253051 1.33281 0.603051 1.26406L6.85305 0.0140625ZM3.4968 10.2391C3.82493 10.1328 4.17805 10.2516 4.41555 10.5047L6.6343 12.8641C6.83118 13.0734 7.16555 13.0734 7.36243 12.8641L9.58118 10.5047C9.81868 10.2516 10.1718 10.1328 10.4999 10.2391C12.5312 10.8922 13.9999 12.7922 13.9999 15.0391C13.9999 15.5703 13.5687 15.9984 13.0406 15.9984H0.959301C0.431176 15.9984 -7.37386e-05 15.5672 -7.37386e-05 15.0391C-7.37386e-05 12.7922 1.46868 10.8922 3.4968 10.2391Z" fill="#1BC1BC"/>
</svg>

)


export const PersonIcon=()=>(
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 8C5.93913 8 4.92172 7.57857 4.17157 6.82843C3.42143 6.07828 3 5.06087 3 4C3 2.93913 3.42143 1.92172 4.17157 1.17157C4.92172 0.421427 5.93913 0 7 0C8.06087 0 9.07828 0.421427 9.82843 1.17157C10.5786 1.92172 11 2.93913 11 4C11 5.06087 10.5786 6.07828 9.82843 6.82843C9.07828 7.57857 8.06087 8 7 8ZM6.53438 11.225L5.95312 10.2563C5.75313 9.92188 5.99375 9.5 6.38125 9.5H7H7.61562C8.00313 9.5 8.24375 9.925 8.04375 10.2563L7.4625 11.225L8.50625 15.0969L9.63125 10.5063C9.69375 10.2531 9.9375 10.0875 10.1906 10.1531C12.3813 10.7031 14 12.6844 14 15.0406C14 15.5719 13.5687 16 13.0406 16H8.92188C8.85625 16 8.79688 15.9875 8.74063 15.9656L8.75 16H5.25L5.25938 15.9656C5.20312 15.9875 5.14062 16 5.07812 16H0.959375C0.43125 16 0 15.5687 0 15.0406C0 12.6812 1.62188 10.7 3.80938 10.1531C4.0625 10.0906 4.30625 10.2563 4.36875 10.5063L5.49375 15.0969L6.5375 11.225H6.53438Z" fill="#1BC1BC"/>
</svg>

)


export const UserLED=()=>(
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 2C5 0.896875 5.89687 0 7 0H18C19.1031 0 20 0.896875 20 2V11C20 12.1031 19.1031 13 18 13H10.525C10.1562 12.2031 9.59062 11.5156 8.8875 11H12V10C12 9.44687 12.4469 9 13 9H15C15.5531 9 16 9.44687 16 10V11H18V2H7V3.53437C6.4125 3.19375 5.72813 3 5 3V2ZM5 4C5.39397 4 5.78407 4.0776 6.14805 4.22836C6.51203 4.37913 6.84274 4.6001 7.12132 4.87868C7.3999 5.15726 7.62087 5.48797 7.77164 5.85195C7.9224 6.21593 8 6.60603 8 7C8 7.39397 7.9224 7.78407 7.77164 8.14805C7.62087 8.51203 7.3999 8.84274 7.12132 9.12132C6.84274 9.3999 6.51203 9.62087 6.14805 9.77164C5.78407 9.9224 5.39397 10 5 10C4.60603 10 4.21593 9.9224 3.85195 9.77164C3.48797 9.62087 3.15726 9.3999 2.87868 9.12132C2.6001 8.84274 2.37913 8.51203 2.22836 8.14805C2.0776 7.78407 2 7.39397 2 7C2 6.60603 2.0776 6.21593 2.22836 5.85195C2.37913 5.48797 2.6001 5.15726 2.87868 4.87868C3.15726 4.6001 3.48797 4.37913 3.85195 4.22836C4.21593 4.0776 4.60603 4 5 4ZM4.16563 11H5.83125C8.13437 11 10 12.8656 10 15.1656C10 15.625 9.62812 16 9.16562 16H0.834375C0.371875 16 0 15.6281 0 15.1656C0 12.8656 1.86563 11 4.16563 11Z" fill="#1BC1BC"/>
</svg>

)



const getIcon = (type: string) => {
  switch (type) {
    case "Parent":
      return <PersonIcon />;
    case "Educator":
      return <UserLED />;
    case "Student":
      return <GraduationCapIcon />;
    case "Alumni":
      return <PersonIcon />;
    default:
      return <PersonIcon />;
  }
};

export default function TargetAudienceCard({
  targetAudience,
  totalRecipients,
  sent,
  pending,
}: TargetAudienceCardProps) {
  return (
    <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm p-4 md:p-6 overflow-hidden">
      <h3 className="text-sm md:text-[16px] font-bold text-custom-gray/95 mb-3 md:mb-4">
        Target Audience
      </h3>
      <div className="space-y-3 md:space-y-4 mb-3 md:mb-4">
        {targetAudience.map((audience, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm md:text-base text-custom-gray/95"
          >
            {getIcon(audience)}
            <span>{audience}</span>
          </div>
        ))}
      </div>
      <div className="pt-3 md:pt-4 border-t border-custom-gray/10 space-y-1.5 md:space-y-2">
        <p className="text-xs md:text-sm text-custom-gray/95">
          Total Recipients: <span className="font-bold">{totalRecipients}</span>
        </p>
        <p className="text-xs md:text-sm text-custom-gray/95">
          Sent: <span className="font-bold text-custom-green">{sent}</span> |{" "}
          Pending: <span className="font-bold" style={{ color: "#F97316" }}>{pending}</span>
        </p>
      </div>
    </div>
  );
}

