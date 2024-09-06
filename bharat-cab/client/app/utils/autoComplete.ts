import { config } from "./config";

export const getAutoCompleteData = async (input) => {
    const data = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&filter=countrycode:auto&apiKey=${config.GEOFI_API_KEY}`
    );

    return data.json();
};
