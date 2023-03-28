import { describe } from "./modules/pine.js";

describe("Pulkka PWA tests", ({ test }) => {
    test("given empty list, when adding stamp, then stamp list should contain arrive stamp with current time", (pine) => {
        givenEmptyStampList(pine);
        pine.get("#btnAddStamp").click();
        const { formattedTimeString } = getUiDateValues(new Date());
        pine.expect(pine.get("#containerStamps").innerHTML).toContain(
            `${formattedTimeString} Töihin tulo`,
            "Stamp list should contain the stamp"
        );
    });

    test("given stamp with the same minute, adding another stamp should not be possible and show error message", (pine) => {
        givenNewlyAddedStamp(pine);
        pine.get("#btnAddStamp").click();
        pine.expect(
            pine.get("#addStampValidationMsg").textContent
        ).toEqual(
            "Samalla minuutilla ei voi lisätä toista merkintää",
            "Error message should be shown"
        );
    });

    test("when editing the time, the time cannot be in future", (pine) => {
        givenNewlyAddedStamp(pine);
        const nextHourDate = roundToExactHours(addHours(new Date(), 1));
        const { dateString, timeString, formattedTimeString } = getUiDateValues(nextHourDate);
        pine.get("#editStamp-0").click();
        pine.get("#inpStampDate").value = dateString;
        pine.get("#inpStampTime").value = timeString;
        pine.get("#btnEditStampModalSave").click();
        pine.expect(
            pine.get("#editStampValidationMsg").textContent
        ).toEqual("Aika ei voi olla tulevaisuudessa");
        pine.get("#btnEditStampModalCancel").click();
    });

    test("when editing stamp, it should be updated on list", (pine) => {
        givenNewlyAddedStamp(pine);
        const previousHourDate = roundToExactHours(addHours(new Date(), -1));
        const { dateString, timeString, formattedTimeString } = getUiDateValues(previousHourDate);
        pine.get("#editStamp-0").click();
        pine.get("#inpStampDate").value = dateString;
        pine.get("#inpStampTime").value = timeString;
        pine.get("#btnEditStampModalSave").click();
        pine.expect(
            pine.get("#containerStamps").innerHTML
        ).toContain(
            `${formattedTimeString} Töihin tulo`,
            "Stamp list should contain the newly edited stamp"
        );
    });

    test("when editing the time, the time cannot be the same as another stamp has", (pine) => {
        givenNewlyAddedStamp(pine);
        const previousHourDate = roundToExactHours(addHours(new Date(), -1));
        const { dateString, timeString, formattedTimeString } = getUiDateValues(previousHourDate);
        pine.get("#editStamp-0").click();
        pine.get("#inpStampDate").value = dateString;
        pine.get("#inpStampTime").value = timeString;
        pine.get("#btnEditStampModalSave").click();
        pine.get("#btnAddStamp").click();
        pine.get("#editStamp-0").click();
        pine.get("#inpStampDate").value = dateString;
        pine.get("#inpStampTime").value = timeString;
        pine.get("#btnEditStampModalSave").click();
        pine.expect(
            pine.get("#editStampValidationMsg").textContent
        ).toEqual("Aika ei voi olla sama kuin toisen merkinnän aika");
        pine.get("#btnEditStampModalCancel").click();
    });

    test("when clearing stamps, then stamp list should become empty", (pine) => {
        givenNewlyAddedStamp(pine);
        pine.get("#btnClearStamps").click();
        pine.get("#btnConfirmModalConfirm").click();
        assertStampListEmpty(pine);
    });

    test("when canceling clearing all stamps, then stamp list should not become empty", (pine) => {
        givenNewlyAddedStamp(pine);
        pine.get("#btnClearStamps").click();
        pine.get("#btnConfirmModalCancel").click();
        pine.expect(
            pine.get("#containerStamps")
                .innerHTML
        ).toContain(
            `Töihin tulo`,
            "Stamp list should contain the stamp"
        );
    });

    test("when deleteing stamp, then stamp list should not contain the deleted stamp", (pine) => {
        givenTwoStamps(pine);
        pine.get("#deleteStamp-1").click();
        pine.get("#btnConfirmModalCancel").click();
        pine.get("#deleteStamp-0").click();
        pine.get("#btnConfirmModalConfirm").click();
        pine.expect(pine.get("#containerStamps").innerHTML).not.toContain(
            `Töistä lähtö`,
            "Stamp list should not contain the stamp"
        );
    });

    test("when canceling delete stamp, then stamp list should contain the deleted stamp", (pine) => {
        givenNewlyAddedStamp(pine);
        pine.get("#deleteStamp-0").click();
        pine.get("#btnConfirmModalCancel").click();
        pine.expect(pine.get("#containerStamps").innerHTML).toContain(
            `Töihin tulo`,
            "Stamp list should contain the stamp"
        );
    });

    test("when the latest stamps date is changed, so that it is not the latest anymore, then if a stamp is added it will have the correct type according to the latest stamp", (pine) => {
        givenTwoStamps(pine);
        const previousHourDate = roundToExactHours(addHours(new Date(), -2));
        const { dateString, timeString, formattedTimeString } = getUiDateValues(previousHourDate);
        pine.get("#editStamp-0").click();
        pine.get("#inpStampDate").value = dateString;
        pine.get("#inpStampTime").value = timeString;
        pine.get("#btnEditStampModalSave").click();
        pine.get("#btnAddStamp").click();
        pine.expect(pine.get("#containerStamps li:nth-child(1)").innerHTML)
            .toContain(
                `Töistä lähtö`,
                "Latest stamp should be of type 'Töistä lähtö'"
            );
    });

    test("given english as localStorage language, when page is loaded, then language should be english", async (pine) => {
        pine.localStorage.setItem("language", "en");
        await pine.reloadPage();
        pine.expect(pine.get("#btnAddStamp").textContent).toEqual("Clock-in to work");
    });

    test("given finnish as localStorage language, when page is loaded, then language should be finnish", async (pine) => {
        pine.localStorage.setItem("language", "fi");
        await pine.reloadPage();
        pine.expect(pine.get("#btnAddStamp").textContent).toEqual("Leimaa sisään töihin");
    });

    test("given unsupported language as localStorage language, when page is loaded, then language should be the default: english", async (pine) => {
        pine.localStorage.setItem("language", "sv");
        await pine.reloadPage();
        pine.expect(pine.get("#btnAddStamp").textContent).toEqual("Clock-in to work");
    });

    test("when changing language, then localStorage language should be updated", async (pine) => {
        pine.localStorage.setItem("language", "fi");
        await pine.reloadPage();
        pine.get("#btnLanguageSelection-en").click();
        pine.expect(pine.localStorage.getItem("language")).toEqual("en");
    });

    test("when changing language, then language in the ui should be updated", async (pine) => {
        pine.localStorage.setItem("language", "fi");
        await pine.reloadPage();
        pine.get("#btnLanguageSelection-en").click();
        pine.expect(pine.get("#btnAddStamp").textContent).toEqual("Clock-in to work");
    });
});

function getUiDateValues(previousHourDate) {
    const dateString = getIsoDateString(previousHourDate);
    const timeString = getTimeForInput(previousHourDate);
    const formattedTimeString = previousHourDate.toLocaleTimeString('fi-FI', { hour: "2-digit", minute: "2-digit" });
    return { dateString, timeString, formattedTimeString };
}

function givenEmptyStampList({ get, exists }) {
    if (exists("#btnLanguageSelection-fi")) {
        get("#btnLanguageSelection-fi").click(); // set language to finnish if it is not already
    }
    get("#btnClearStamps").click();
    get("#btnConfirmModalConfirm").click();
}

function givenNewlyAddedStamp({ get, exists }) {
    givenEmptyStampList({ get, exists });
    get("#btnAddStamp").click();
}

/**
 * contains two stamps, one with current time and one with previous hour
 */
function givenTwoStamps({ get, exists }) {
    givenNewlyAddedStamp({ get, exists });
    const previousHourDate = roundToExactHours(addHours(new Date(), -1));
    const { dateString, timeString, formattedTimeString } = getUiDateValues(previousHourDate);
    get("#editStamp-0").click();
    get("#inpStampDate").value = dateString;
    get("#inpStampTime").value = timeString;
    get("#btnEditStampModalSave").click();
    get("#btnAddStamp").click();
}

function assertStampListEmpty(pine) {
    for (const stampType of ['Töihin tulo', 'Töistä lähtö']) {
        pine.expect(
            pine.get("#containerStamps").innerHTML
        ).not.toContain(stampType);
    }
}

function addHours(date, hours) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function roundToExactHours(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0, 0);
}

/**
 * Get a string representation of a date that can be used as a value for an input[type="time"] element.
 * 
 * @param {Date} date
 */
function getTimeForInput(date) {
    return toPaddedString(date.getHours(), 2) + ":" + toPaddedString(date.getMinutes(), 2);
}

/**
 * Convert a number to a string with a fixed length filled with leading zeros.
 * 
 * @param {number} number
 * @param {number} length
 */
export function toPaddedString(number, length) {
    return number.toString().padStart(length, '0');
}

/**
 * Get a string representation of a date that can be used as a value for an input[type="date"] element.
 * 
 * @param {Date} date
 * @returns {string}
 * @example
 * getISODateString(new Date(2020, 0, 1)) // "2020-01-01"
 * getISODateString(new Date(2020, 11, 31)) // "2020-12-31"
 */
function getIsoDateString(date) {
    return toPaddedString(date.getFullYear(), 4) + "-" + toPaddedString(date.getMonth() + 1, 2) + "-" + toPaddedString(date.getDate(), 2);
}