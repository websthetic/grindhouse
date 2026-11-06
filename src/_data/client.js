module.exports = {
    name: "Grindhouse",
    email: "[email@grindhouse.ca]", // TODO: real email
    phoneForTel: "", // TODO: digits only, e.g. 905-555-0123
    phoneFormatted: "[Phone number]", // TODO
    address: {
        lineOne: "1215 Queensway E #44",
        lineTwo: "",
        city: "Mississauga",
        state: "ON",
        zip: "L4Y 3Y3",
        country: "CA",
        mapLink: "https://www.google.com/maps/search/?api=1&query=1215+Queensway+E+%2344+Mississauga+ON+L4Y+3Y3",
    },
    // Opening hours (shown in the footer)
    hours: [
        { days: "Monday – Thursday", time: "7:00am – 7:00pm" },
        { days: "Friday", time: "7:00am – 4:00pm" },
        { days: "Saturday", time: "9:00am – 1:00pm" },
        { days: "Sunday", time: "Closed" },
    ],
    socials: {
        facebook: "#", // TODO
        instagram: "#", // TODO
    },
    //! Make sure you include the file protocol (e.g. https://) and that NO TRAILING SLASH is included
    domain: "https://www.example.com",
    // Current year for the footer copyright
    year: new Date().getFullYear(),
    // Passing the isProduction variable for use in HTML templates
    isProduction: process.env.ELEVENTY_ENV === "PROD",
};
