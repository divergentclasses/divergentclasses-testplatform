import React from "react";
import { useNavigate } from "react-router-dom";

export default function SubmitPage() {
  const navigate = useNavigate();
  const PaperID = localStorage.getItem("testId");
  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <div className="text-3xl">You have successfully submitted your </div>
      <div className="text-3xl">Test!</div>
      <div className="my-3">
        <button
          onClick={() => {
            navigate(`/result/${PaperID}`);
          }}
          className="underline text-blue-500">
          View Result
        </button>
      </div>
    </div>
  );
}
