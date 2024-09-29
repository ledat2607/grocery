'use client'

import { Separator } from "./ui/separator";

interface HeadingProps {
  title: string;
  description: string;
}

export const Heading = ({ title, description }: HeadingProps) => {
  return (
    <>
      <div className="w-full ">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-sm font-light mt-2">{description}</p>
      </div>
    </>
  );
};
