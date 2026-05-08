"use client";

import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

type GenerateSurveyWithAIProps = {
  onClick?: () => void;
  isLoading?: boolean;
};


export const SparklesIcon=()=>(
  <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.3691 3.2478C21.9405 3.2478 27.3418 8.57492 27.3418 15.1462C27.3418 21.7176 21.9405 27.0447 15.3691 27.0447C8.79788 27.0446 3.39648 21.7175 3.39648 15.1462C3.39648 8.57496 8.79788 3.24788 15.3691 3.2478Z" fill="#0FB3FF"/>
<path d="M15.3691 3.2478C21.9405 3.2478 27.3418 8.57492 27.3418 15.1462C27.3418 21.7176 21.9405 27.0447 15.3691 27.0447C8.79788 27.0446 3.39648 21.7175 3.39648 15.1462C3.39648 8.57496 8.79788 3.24788 15.3691 3.2478Z" stroke="#E5E7EB"/>
<g filter="url(#filter0_ddd_1095_313)">
<g clip-path="url(#clip0_1095_313)">
<path d="M14.2545 10.2389L13.466 10.5338C13.4033 10.5568 13.3614 10.6175 13.3614 10.6844C13.3614 10.7513 13.4033 10.812 13.466 10.835L14.2545 11.1299L14.5494 11.9184C14.5724 11.9811 14.6331 12.023 14.7 12.023C14.7669 12.023 14.8276 11.9811 14.8506 11.9184L15.1455 11.1299L15.934 10.835C15.9967 10.812 16.0386 10.7513 16.0386 10.6844C16.0386 10.6175 15.9967 10.5568 15.934 10.5338L15.1455 10.2389L14.8506 9.4504C14.8276 9.38766 14.7669 9.34583 14.7 9.34583C14.6331 9.34583 14.5724 9.38766 14.5494 9.4504L14.2545 10.2389ZM10.3099 17.6157C9.91878 18.0068 9.91878 18.6426 10.3099 19.0358L11.0336 19.7595C11.4247 20.1506 12.0605 20.1506 12.4537 19.7595L20.4287 11.7824C20.8198 11.3913 20.8198 10.7555 20.4287 10.3623L19.705 9.64073C19.3139 9.24962 18.6781 9.24962 18.2849 9.64073L10.3099 17.6157ZM19.4812 11.0734L17.2851 13.2695L16.7978 12.7822L18.9939 10.5861L19.4812 11.0734ZM9.50257 11.7971C9.40845 11.8326 9.3457 11.9226 9.3457 12.023C9.3457 12.1234 9.40845 12.2133 9.50257 12.2489L10.6843 12.6923L11.1277 13.874C11.1632 13.9681 11.2532 14.0308 11.3536 14.0308C11.454 14.0308 11.5439 13.9681 11.5794 13.874L12.0229 12.6923L13.2046 12.2489C13.2987 12.2133 13.3614 12.1234 13.3614 12.023C13.3614 11.9226 13.2987 11.8326 13.2046 11.7971L12.0229 11.3537L11.5794 10.172C11.5439 10.0779 11.454 10.0151 11.3536 10.0151C11.2532 10.0151 11.1632 10.0779 11.1277 10.172L10.6843 11.3537L9.50257 11.7971ZM16.8647 17.1514C16.7706 17.1869 16.7079 17.2769 16.7079 17.3773C16.7079 17.4777 16.7706 17.5676 16.8647 17.6032L18.0464 18.0466L18.4898 19.2283C18.5254 19.3224 18.6153 19.3851 18.7157 19.3851C18.8161 19.3851 18.9061 19.3224 18.9416 19.2283L19.385 18.0466L20.5667 17.6032C20.6608 17.5676 20.7236 17.4777 20.7236 17.3773C20.7236 17.2769 20.6608 17.1869 20.5667 17.1514L19.385 16.708L18.9416 15.5263C18.9061 15.4322 18.8161 15.3694 18.7157 15.3694C18.6153 15.3694 18.5254 15.4322 18.4898 15.5263L18.0464 16.708L16.8647 17.1514Z" fill="white"/>
</g>
</g>
<defs>
<filter id="filter0_ddd_1095_313" x="-0.000102997" y="-2.52842" width="30.7387" height="35.3494" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="1.5928"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.654902 0 0 0 0 0.952941 0 0 0 0 0.815686 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1095_313"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="3.1856"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.654902 0 0 0 0 0.952941 0 0 0 0 0.815686 0 0 0 1 0"/>
<feBlend mode="normal" in2="effect1_dropShadow_1095_313" result="effect2_dropShadow_1095_313"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="4.6729"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.203922 0 0 0 0 0.827451 0 0 0 0 0.6 0 0 0 1 0"/>
<feBlend mode="normal" in2="effect2_dropShadow_1095_313" result="effect3_dropShadow_1095_313"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow_1095_313" result="shape"/>
</filter>
<clipPath id="clip0_1095_313">
<path d="M9.3457 9.34583H21.3929V20.0544H9.3457V9.34583Z" fill="white"/>
</clipPath>
</defs>
</svg>

)

export default function GenerateSurveyWithAI({
  onClick,
  isLoading = false,
}: GenerateSurveyWithAIProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push("/pulse-survey/generate/ai");
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant="filled"
      rounded="full"
      bgColor="bg-custom-teal"
      hoverBgColor="hover:bg-custom-blue"
      textColor="text-custom-white"
      className="font-medium py-2 px-2  flex items-center justify-center gap-3 whitespace-nowrap text-sm w-full md:w-auto"
    >
      {isLoading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          <span>Generating Survey...</span>
        </>
      ) : (
        <>
          <span className="text-sm">Generate Survey with AI</span>
        <SparklesIcon/>
        </>
      )}
    </Button>
  );
}

