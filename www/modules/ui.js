
import { STAMP_TYPES } from "./model.js";
import { download } from "./utils/download.js";
import { toPaddedString } from "./utils/number.js";


export class UI {
    #logic;
    #language;
    #elems;

    /**
     * @param {import("./logic").Logic} logic
     * @param {import("./language").Language} language
     */
    constructor(logic, language) {
        this.#logic = logic;
        this.#language = language;

        this.#elems = {
            btnAddStamp: document.getElementById("btnAddStamp"),
            btnClearStamps: document.getElementById("btnClearStamps"),
            containerStamps: document.getElementById("containerStamps"),
            headingTitle: document.getElementById("headingTitle"),
            txtWelcomeText: document.getElementById("txtWelcomeText"),
            headingStamps: document.getElementById("headingStamps"),
            btnEditStampModalSave: document.getElementById("btnEditStampModalSave"),
            btnEditStampModalCancel: document.getElementById("btnEditStampModalCancel"),
            editStampModal: document.getElementById("editStampModal"),
            selStampType: document.getElementById("selStampType"),
            inpStampTime: document.getElementById("inpStampTime"),
            editStampValidationMsg: document.getElementById("editStampValidationMsg"),
            addStampValidationMsg: document.getElementById("addStampValidationMsg"),
            lblStampTime: document.getElementById("lblStampTime"),
            lblStampType: document.getElementById("lblStampType"),
            editStampModalHeading: document.getElementById("editStampModalHeading"),
            lblStampDate: document.getElementById("lblStampDate"),
            inpStampDate: document.getElementById("inpStampDate"),
            confirmModal: document.getElementById("confirmModal"),
            confirmModalHeading: document.getElementById("confirmModalHeading"),
            confirmModalText: document.getElementById("confirmModalText"),
            confirmModalConfirm: document.getElementById("btnConfirmModalConfirm"),
            confirmModalCancel: document.getElementById("btnConfirmModalCancel"),
            aboutModal: document.getElementById("aboutModal"),
            btnAboutModalClose: document.getElementById("btnAboutModalClose"),
            aboutModalHeading: document.getElementById("aboutModalHeading"),
            aboutModalText: document.getElementById("aboutModalText"),
            btnAbout: document.getElementById("btnAbout"),
            btnDownloadStampsCsv: document.getElementById("btnDownloadStampsCsv"),
            containerLanguageSelection: document.getElementById("containerLanguageSelection"),
            spanAppVersion: document.getElementById("spanAppVersion"),
            footerText: document.getElementById("footerText"),
        };

        this.bindInitialDomEvents();

        this.#language.addLanguageChangeListener(() => {
            this.refreshInitialView();
        })

        this.refreshInitialView();
    }

    /**
     * Binds the elements to their logic.
     * This should be called only once when the body has been loaded.
     */
    bindInitialDomEvents() {
        this.#elems.btnAddStamp.addEventListener("click", () => {
            this.#logic.addCurrentStamp();
            this.refreshStampList();
            this.refreshAddStampButton();
            if (this.#logic.addStampValidationErrors) {
                this.#elems.addStampValidationMsg.textContent = this.#logic.addStampValidationErrors
                    .map(errorType => this.#language.t(`addStampValidationErrors.${errorType}`))
                    .join(', ');
                this.#elems.addStampValidationMsg.style.display = "block";
            } else {
                this.#elems.addStampValidationMsg.style.display = "none";
            }
        });
        this.#elems.btnClearStamps.addEventListener("click", () => {
            this.showConfirmModal({
                title: this.#language.t("deleteAllStamps"),
                message: this.#language.t("deleteAllStampsConfirmationMessage"),
                onConfirm: () => {
                    this.#logic.clearStamps();
                    this.refreshStampList();
                    this.refreshAddStampButton();
                },
                confirmText: this.#language.t("deleteAllStamps"),
            });
        });
        this.#elems.btnEditStampModalSave.addEventListener("click", () => {
            // @ts-ignore
            const date = this.#elems.inpStampDate.valueAsDate
            // @ts-ignore
            const time = this.#elems.inpStampTime.valueAsDate
            this.#logic.saveEditedStamp({
                date: new Date(date.getFullYear(), date.getMonth(),
                    date.getDate(), time.getUTCHours(), time.getUTCMinutes()),
                // @ts-ignore
                stampType: this.#elems.selStampType.value
            });
            this.refreshStampList();
            this.refreshEditStampDialog()
            this.refreshAddStampButton();
        })
        this.#elems.btnEditStampModalCancel.addEventListener("click", () => {
            this.#logic.cancelEditingStamp();
            this.refreshStampList();
            this.refreshEditStampDialog()
        })
        this.#elems.btnAboutModalClose.addEventListener("click", () => {
            this.hideAboutModal();
        });
        this.#elems.btnAbout.addEventListener("click", () => {
            this.showAboutModal();
        });
        this.#elems.btnDownloadStampsCsv.addEventListener("click", () => {
            this.downloadStampCsv();
        });
    }

    refreshInitialView() {
        this.refreshAddStampButton();
        this.refreshStampList();
        this.refreshInitialViewTexts();
        this.refreshLanguageSelection();
    }

    refreshInitialViewTexts() {
        document.title = this.#language.t("title");
        document.documentElement.lang = this.#language.language;
        this.#elems.btnAbout.textContent = "🤔"
        this.#elems.btnAbout.title = this.#language.t("about");
        this.#elems.btnDownloadStampsCsv.textContent = this.#language.t("exportCsv");
        this.#elems.lblStampTime.textContent = this.#language.t("time");
        this.#elems.lblStampType.textContent = this.#language.t("stampType");
        this.#elems.editStampModalHeading.textContent = this.#language.t("editingStamp");
        this.#elems.lblStampDate.textContent = this.#language.t("date");
        this.#elems.aboutModalText.textContent = this.#language.t("aboutText");
        this.#elems.aboutModalHeading.textContent = this.#language.t("about");
        this.#elems.btnAboutModalClose.textContent = this.#language.t("close");
        this.#elems.btnEditStampModalSave.textContent = this.#language.t("save");
        this.#elems.btnEditStampModalCancel.textContent = this.#language.t("cancel");
        this.#elems.headingTitle.textContent = this.#language.t("title");
        this.#elems.txtWelcomeText.textContent = this.#language.t("welcomeText");
        this.#elems.headingStamps.textContent = this.#language.t("stamps");
        this.#elems.btnClearStamps.textContent =
            this.#language.t("clearStamps");
        this.#elems.footerText.textContent = `© Atte Virtanen ${new Date().getFullYear()}`;
    }

    refreshLanguageSelection() {
        this.#elems.containerLanguageSelection.textContent = "";
        let isFirst = true;
        for (const lang of this.#language.supportedLanguages) {
            if(!isFirst) this.#elems.containerLanguageSelection.appendChild(document.createTextNode(" | "));
            if(lang === this.#language.language) { 
                this.#elems.containerLanguageSelection.appendChild(document.createTextNode(lang))
            } else {
                const btn = document.createElement("button");
                btn.textContent = lang;
                btn.id = `btnLanguageSelection-${lang}`;
                btn.addEventListener("click", () => {
                    this.#language.language = lang;
                });
                this.#elems.containerLanguageSelection.appendChild(btn);            
            }
            isFirst = false;
        }
    }

    refreshAddStampButton() {
        if (this.#logic.isAtWork) {
            this.#elems.btnAddStamp.textContent = this.#language.t("signOutOfWork");
            this.#elems.btnAddStamp.className = "leaveStyle";
        } else {
            this.#elems.btnAddStamp.textContent = this.#language.t("signInToWork");
            this.#elems.btnAddStamp.className = "arriveStyle";
        }
    }

    refreshStampList() {
        this.#elems.containerStamps.innerHTML = "";
        if (Object.keys(this.#logic.stampsByDate).length > 0) {
            let stampIndex = 0;
            for (const date in this.#logic.stampsByDate) {
                const stamps = this.#logic.stampsByDate[date];
                const day = new Date(date);
                this.#elems.containerStamps.appendChild(this.createDayHeading(day));
                const ul = document.createElement("ul");
                for (const stamp of stamps) {
                    const li = document.createElement("li");
                    li.textContent = `${formatTime(stamp.date, this.#language.language)} ${this.renderStampType(
                        stamp.stampType
                    )}`;
                    li.className = stamp.stampType === STAMP_TYPES.IN ? "arrive" : "leave";
                    const editStampBtn = document.createElement("button");
                    editStampBtn.id = `editStamp-${stampIndex}`
                    editStampBtn.textContent = this.#language.t("edit");
                    editStampBtn.className = "editStampBtn";
                    editStampBtn.addEventListener("click", () => {
                        this.#logic.startEditingStamp(stamp.date);
                        this.refreshEditStampDialog();
                    });
                    li.appendChild(editStampBtn);
                    const deleteStampBtn = document.createElement("button");
                    deleteStampBtn.textContent = this.#language.t("delete");
                    deleteStampBtn.id = `deleteStamp-${stampIndex}`
                    deleteStampBtn.className = "deleteStampBtn";
                    deleteStampBtn.addEventListener("click", () => {
                        this.showConfirmModal({
                            title: this.#language.t("deleteStamp"),
                            message: this.#language.t("deleteStampConfirmationMessage"),
                            onConfirm: () => {
                                this.#logic.deleteStamp(stamp.date);
                                this.refreshStampList();
                                this.refreshAddStampButton();
                            },
                            confirmText: this.#language.t("deleteStamp"),
                        });
                    });
                    li.appendChild(deleteStampBtn);
                    ul.appendChild(li);
                    stampIndex++;
                }
                this.#elems.containerStamps.appendChild(ul);
            }
        } else {
            const txtNoStamps = document.createElement("p");
            txtNoStamps.textContent = this.#language.t("noStamps");
            this.#elems.containerStamps.appendChild(txtNoStamps);
        }
    }

    refreshEditStampDialog() {
        const stamp = this.#logic.editedStamp
        this.#elems.selStampType.innerText = '';
        Object.values(STAMP_TYPES).forEach((stampType) => {
            const option = document.createElement("option");
            option.value = stampType;
            option.textContent = this.renderStampType(stampType);
            this.#elems.selStampType.appendChild(option);
        });

        if (stamp) {
            this.#elems.editStampModal.style.display = "block";
            // @ts-ignore
            this.#elems.inpStampTime.value = getTimeForInput(stamp.date);
            // @ts-ignore
            this.#elems.selStampType.value = stamp.stampType;
            // @ts-ignore
            this.#elems.inpStampDate.value = getIsoDateString(stamp.date);

            if (this.#logic.editStampValidationErrors) {
                this.#elems.editStampValidationMsg.textContent = this.#logic.editStampValidationErrors
                    .map(errorType => this.#language.t(`editStampValidationErrors.${errorType}`))
                    .join(', ');
                this.#elems.editStampValidationMsg.style.display = "block";
            } else {
                this.#elems.editStampValidationMsg.style.display = "none";
            }
        } else {
            this.#elems.editStampModal.style.display = "none";
        }
    }

    showConfirmModal({ title, message, onConfirm, confirmText = null, cancelText = null }) {
        this.#elems.confirmModal.style.display = "block";
        this.#elems.confirmModalHeading.textContent = title;
        this.#elems.confirmModalText.textContent = message;
        this.#elems.confirmModalConfirm.textContent = confirmText ?? this.#language.t("ok");
        this.#elems.confirmModalCancel.textContent = cancelText ?? this.#language.t("cancel");
        const that = this;
        function handleConfirm() {
            that.#elems.confirmModal.style.display = "none";
            onConfirm();
            that.#elems.confirmModalConfirm.removeEventListener("click", handleConfirm);
            that.#elems.confirmModalCancel.removeEventListener("click", handleCancel);
        }
        function handleCancel() {
            that.#elems.confirmModal.style.display = "none";
            that.#elems.confirmModalConfirm.removeEventListener("click", handleConfirm);
            that.#elems.confirmModalCancel.removeEventListener("click", handleCancel);
        }
        this.#elems.confirmModalConfirm.addEventListener("click", handleConfirm)
        this.#elems.confirmModalCancel.addEventListener("click", handleCancel)
    }

    showAboutModal() {
        this.#elems.aboutModal.style.display = "block";
    }

    hideAboutModal() {
        this.#elems.aboutModal.style.display = "none";
    }

    /**
     * @param {{ toDateString: () => string; }} date
     */
    createDayHeading(date) {
        const heading = document.createElement("h3");
        if (date.toDateString() === new Date().toDateString()) {
            heading.textContent = this.#language.t("today");
        } else {
            heading.textContent = formatDate(date, this.#language.language);
        }
        return heading;
    }

    /**
     * @param {any} stampType
     */
    renderStampType(stampType) {
        switch (stampType) {
            case STAMP_TYPES.IN:
                return this.#language.t("cameToWork");
            case STAMP_TYPES.OUT:
                return this.#language.t("leftWork");
            default:
                return stampType;
        }
    }

    downloadStampCsv() {
        const dateStr = getIsoDateString(new Date());
        download(this.#logic.createStampCsv(), `pulkka-stamps-${dateStr}.csv`, "text/csv");
    }

    renderAppInfo({ version }) {
        this.#elems.spanAppVersion.textContent = `v. ${version}`;
    }
}


function formatDate(date, lang) {
    switch (lang) {
        case 'fi':
            return date.toLocaleDateString('fi-FI');
        default:
            return date.toLocaleDateString('en-US');
    }
}

function formatTime(date, lang) {
    switch (lang) {
        case 'fi':
            return date.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' });
        default:
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
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