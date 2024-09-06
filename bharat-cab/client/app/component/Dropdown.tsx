export default function Dropdown({
    autoCompleteData,
    isAutoComplete,
    handleClick,
}) {
    return (
        <div>
            {isAutoComplete && autoCompleteData.length > 0 && (
                <div className="dropdown rounded-lg border-2 w-80 p-2">
                    <ul>
                        {autoCompleteData.map((loc, ind) => (
                            <li className="dropdown-list " key={ind}>
                                <button
                                    className="text-lg text-left truncate  w-full overflow-hidden border-b-2 text-white"
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
