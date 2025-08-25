"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

interface FloatingChatButtonProps {
  onClick: () => void;
  isVisible?: boolean;
}

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({
  onClick,
  isVisible = true,
}) => {
  if (!isVisible) return null;

  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 bg-primary hover:bg-primary/90 border-2 border-background"
      size="icon"
    >
      <Bot className="w-6 h-6 text-primary-foreground" />
      <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping scale-110"></div>
    </Button>
  );
};
