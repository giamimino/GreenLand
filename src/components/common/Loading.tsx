export default function Loading() {
  return (
    <div className="flex-col gap-4 w-full flex items-center justify-center]" style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }}>
      <div
        className="w-20 h-20 border-4 border-transparent text-black text-4xl animate-spin flex items-center justify-center border-t-black rounded-full"
      >
        <div
          className="w-16 h-16 border-4 border-transparent text-[#C1DCDC] text-2xl animate-spin flex items-center justify-center border-t-[#C1DCDC] rounded-full"
        ></div>
      </div>
    </div>
  );
}
