export default function InputPrice() {
    return (
        <div className="text-black flex flex-col max-w-[380px] mt-14 gap-3 ">
            <input
                type="text"
                className="h-12 rounded-lg text-left px-4"
                placeholder="Enter location"
            />

            <input
                type="text"
                className="h-12 rounded-lg text-left px-4"
                placeholder="Enter destination"
            />
            <button className="text-black bg-white w-32 py-2 px-3 rounded-lg mt-4 hover:bg-slate-300 font-bold cursor-not-allowed">
                See prices
            </button>
        </div>
    );
}
