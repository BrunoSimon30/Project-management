import React from "react";

export default function FieldError({ error }) {
  if (!error) return null;
  return <p className="mt-1 text-xs text-red-500">{error.message}</p>;
}
