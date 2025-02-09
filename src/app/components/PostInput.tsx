"use client"

import { Icon } from "@iconify/react";

export default function PostInput() {
  return (
    <div className="w-[30%] max-h-[80%] overflow-auto bg-stone-900 p-4 rounded-lg grid grid-rows-[20px_1fr_40px]">
      <div className="flex justify-between items-center">
        <Icon icon="mdi:close" width="24" height="24" />
        Drafts
      </div>
    </div>
  )
}