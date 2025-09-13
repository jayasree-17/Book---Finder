import React from "react";

export default function LinkPage(params) {
  return (
    <div className="w-screen h-screen bg-gradient-to-b from-blue-500 to-green-400 flex flex-row justify-center items-center">
      <div className="flex flex-col w-full">
        <div className="flex flex-col justify-center items-center">
          <div className="py-2">
            <img src={"/profile.jpg"} alt={"avatar"} className="rounded-full w-24 h-24 object-cover" />
          </div>
          <div className="py-2 text-white font-medium">@guanghuizeng</div>
        </div>
        <div className="flex flex-col items-center py-4 ">
          <div className="w-4/5 md:w-96">
            {
              [
                {
                  label: "Twitter"
                },
                {
                  label: "GitHub"
                },
                {
                  label: "Jike"
                }
              ].map((link) => {
                return (
                  <div key={link.label} className="flex flex-col justify-center items-center h-16 w-full my-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 cursor-pointer"><span>{link.label}</span></div>
                )
              })
            }
          </div>

        </div>
      </div>
    </div>
  );
}
