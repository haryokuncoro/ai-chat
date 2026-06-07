"use client";

import { useEffect, useState } from "react";
import { createSession } from "@/services/chat-service";

export function useSession() {
  const [sessionId, setSessionId] =
    useState("");

  useEffect(() => {
    createSession().then(
      setSessionId
    );
  }, []);

  return sessionId;
}