import { getSettings, setSettings, ISettings } from "../shared/settings.ts";

export class SettingsManager {
    private _settings: ISettings | null = null;

    /**
     * Usage:
     *   const settings = await settingsManager.load();
     *   // Use settingsManager.get("showTags") to access individual options after loading
     */
    async load(): Promise<ISettings> {
        this._settings = await getSettings();
        const s = this._settings;
        // UI update logic should be handled in the caller
        return s;
    }

    /**
     * Usage:
     *   await settingsManager.save(settingsObject);
     *   // settingsObject must be of type ISettings
     */
    async save(settings: ISettings): Promise<void> {
        this._settings = settings;
        await setSettings(settings);
    }

    /**
     * Usage:
     *   const value = settingsManager.get("showTags"); // boolean | undefined
     *   const tags = settingsManager.get("includeTags"); // string[] | undefined
     */
    get<K extends keyof ISettings>(key: K): ISettings[K] | undefined {
        return this._settings ? this._settings[key] : undefined;
    }

    /**
     * Usage:
     *   await settingsManager.set("showTags", true);
     *   await settingsManager.set("includeTags", ["safe", "pony"]);
     */
    async set<K extends keyof ISettings>(key: K, value: ISettings[K]): Promise<void> {
        if (!this._settings) {
            this._settings = await getSettings();
        }
        this._settings[key] = value;
        await setSettings(this._settings);
    }
}
