"use client";

const DEFAULT_API_URL = "http://localhost:3000/api/v1";

export function useApi() {
  return {
    apiUrl: process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL,
  };
}