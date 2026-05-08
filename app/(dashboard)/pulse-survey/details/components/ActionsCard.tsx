"use client";

import Button from "@/components/ui/Button";
import { Send, X, Download } from "lucide-react";




export const SendIcon=()=>(
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1101_1582)">
<path d="M15.5657 0.174997C15.8813 0.393747 16.047 0.771872 15.9876 1.15L13.9876 14.15C13.9407 14.4531 13.7563 14.7187 13.4876 14.8687C13.2188 15.0187 12.897 15.0375 12.6126 14.9187L8.87508 13.3656L6.73446 15.6812C6.45633 15.9844 6.01883 16.0844 5.63446 15.9344C5.25008 15.7844 5.00008 15.4125 5.00008 15V12.3875C5.00008 12.2625 5.04696 12.1437 5.13133 12.0531L10.3688 6.3375C10.5501 6.14062 10.5438 5.8375 10.3563 5.65C10.1688 5.4625 9.86571 5.45 9.66883 5.62812L3.31258 11.275L0.553206 9.89375C0.221956 9.72812 0.00945635 9.39687 8.13452e-05 9.02812C-0.00929365 8.65937 0.184456 8.31562 0.503206 8.13125L14.5032 0.131247C14.8376 -0.0593776 15.2501 -0.0406276 15.5657 0.174997Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_1101_1582">
<path d="M0 0H16V16H0V0Z" fill="white"/>
</clipPath>
</defs>
</svg>

)
export const CloseIcon=()=>(
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16ZM6 5H10C10.5531 5 11 5.44688 11 6V10C11 10.5531 10.5531 11 10 11H6C5.44688 11 5 10.5531 5 10V6C5 5.44688 5.44688 5 6 5Z" fill="#374151"/>
</svg>

)
export const DownloadIcon=()=>(
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 1C9 0.446875 8.55313 0 8 0C7.44688 0 7 0.446875 7 1V8.58438L4.70625 6.29063C4.31563 5.9 3.68125 5.9 3.29063 6.29063C2.9 6.68125 2.9 7.31563 3.29063 7.70625L7.29063 11.7063C7.68125 12.0969 8.31563 12.0969 8.70625 11.7063L12.7063 7.70625C13.0969 7.31563 13.0969 6.68125 12.7063 6.29063C12.3156 5.9 11.6812 5.9 11.2906 6.29063L9 8.58438V1ZM2 11C0.896875 11 0 11.8969 0 13V14C0 15.1031 0.896875 16 2 16H14C15.1031 16 16 15.1031 16 14V13C16 11.8969 15.1031 11 14 11H10.8281L9.4125 12.4156C8.63125 13.1969 7.36562 13.1969 6.58437 12.4156L5.17188 11H2ZM13.5 12.75C13.6989 12.75 13.8897 12.829 14.0303 12.9697C14.171 13.1103 14.25 13.3011 14.25 13.5C14.25 13.6989 14.171 13.8897 14.0303 14.0303C13.8897 14.171 13.6989 14.25 13.5 14.25C13.3011 14.25 13.1103 14.171 12.9697 14.0303C12.829 13.8897 12.75 13.6989 12.75 13.5C12.75 13.3011 12.829 13.1103 12.9697 12.9697C13.1103 12.829 13.3011 12.75 13.5 12.75Z" fill="#374151"/>
</svg>


)

type ActionsCardProps = {
  onSendReminder?: () => void;
  onCloseSurvey?: () => void;
  onExportData?: () => void;
};

export default function ActionsCard({
  onSendReminder,
  onCloseSurvey,
  onExportData,
}: ActionsCardProps) {
  return (
    <div className="bg-custom-white w-full md:w-[362px] rounded-lg border border-custom-gray/10 shadow-sm p-4 md:p-6 overflow-hidden">
      <h3 className="text-sm md:text-base font-semibold text-custom-gray/95 mb-3 md:mb-4">
        Actions
      </h3>
      <div className="space-y-2 md:space-y-3">
        <Button
          variant="filled"
          rounded="full"
          bgColor="bg-custom-purple"
          hoverBgColor="hover:opacity-90"
          textColor="text-custom-white"
          onClick={onSendReminder}
          className="w-full h-10 md:h-12 text-sm md:text-[16px] flex items-center gap-2 md:gap-3 !justify-start px-4 md:px-5"
        >
        <SendIcon/>
          Send Reminder
        </Button>
        <Button
          variant="filled"
          rounded="full"
          bgColor="bg-custom-gray/10"
          hoverBgColor="hover:bg-custom-gray/10 hover:opacity-90"
          textColor="text-custom-gray/95"
          onClick={onCloseSurvey}
          className="w-full h-10 md:h-12 text-sm md:text-[16px] flex items-center gap-2 md:gap-3 !justify-start px-4 md:px-5"
        >
        <CloseIcon/>
          Close Survey
        </Button>
        <Button
          variant="filled"
          rounded="full"
          bgColor="bg-custom-gray/10"
          hoverBgColor="hover:bg-custom-gray/10 hover:opacity-90"
          textColor="text-custom-gray/95"
          onClick={onExportData}
          className="w-full h-10 md:h-12 text-sm md:text-[16px] flex items-center gap-2 md:gap-3 !justify-start px-4 md:px-5"
        >
        <DownloadIcon/>
          Export Data (CSV/PDF)
        </Button>
      </div>
    </div>
  );
}

