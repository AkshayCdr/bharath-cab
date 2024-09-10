export default function Dropdown({
    autoCompleteData,
    isAutoComplete,
    handleClick,
}) {
    return (
        <div className="">
            {isAutoComplete && autoCompleteData.length > 0 && (
                <div className="absolute dropdown rounded-lg border-2 w-80 p-2 opacity-100 bg-white">
                    <ul>
                        {autoCompleteData.map((loc, ind) => (
                            <li className="dropdown-list " key={ind}>
                                <button
                                    className="z-10 text-lg text-left truncate  w-full overflow-hidden border-b-2 text-black"
                                    onClick={() => handleClick(loc)}
                                >
                                    {loc.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
