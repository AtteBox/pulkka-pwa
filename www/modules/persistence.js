export class Persistence {
    get stamps() {
        const rawStamps = localStorage.getItem("stamps") ?? "[]";

        return JSON.parse(rawStamps).map(({ date, ...rest }) => ({
            date: new Date(date),
            ...rest,
        }));
    }

    set stamps(stamps) {
        localStorage.setItem("stamps", JSON.stringify(stamps));
    }
}
