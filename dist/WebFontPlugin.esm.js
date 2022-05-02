/**
 * @author       Fielding Johnston <fielding@justfielding.com> 
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */ const $9f91d4c358402caa$var$IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
const $9f91d4c358402caa$var$GetFastValue = Phaser.Utils.Objects.GetFastValue;
class $9f91d4c358402caa$export$2e2bcd8739ae039 extends Phaser.Loader.File {
    variantsProcessed = [];
    constructor(loader, key, url, variants, testString, legacyTimeout){
        if ($9f91d4c358402caa$var$IsPlainObject(key)) {
            const config = key;
            key = $9f91d4c358402caa$var$GetFastValue(config, 'key');
            url = $9f91d4c358402caa$var$GetFastValue(config, 'url');
            variants = $9f91d4c358402caa$var$GetFastValue(config, 'variants', [
                'normal'
            ]);
            testString = $9f91d4c358402caa$var$GetFastValue(config, 'testString');
            legacyTimeout = $9f91d4c358402caa$var$GetFastValue(config, 'legacyTimeout');
        } else if (variants === undefined) variants = [
            'normal'
        ];
        const fileConfig = {
            type: 'webfont',
            key: key,
            url: url,
            config: {
                variants: variants,
                testString: testString,
                legacyTimeout: legacyTimeout
            }
        };
        super(loader, fileConfig);
    }
    load() {
        const link = document.createElement('link');
        link.href = this.url;
        link.rel = 'stylesheet';
        link.onload = document.fonts ? this.loadFont.bind(this) : this.loadFontLegacy.bind(this);
        document.head.appendChild(link);
        return this;
    }
    onLoad() {
        this.loader.nextFile(this, true);
    }
    onVariantProcessed(variant) {
        this.variantsProcessed.push(variant);
        if (this.config.variants.length === this.variantsProcessed.length) this.onLoad();
    }
    loadFont() {
        this.config.variants.forEach((variant)=>{
            document.fonts.load(`${variant} 12px '${this.key}'`, this.config?.testString).then(this.onVariantProcessed.bind(this, variant)).catch((err)=>{
                console.warn('WebFontPlugin Error: ', err);
                this.onVariantProcessed(variant);
            });
        });
    }
    // Note: not 100% sure this works.. it seemed to with my initial testings though
    loadFontLegacy() {
        return Promise.all(this.config.variants.map((variant)=>{
            return new Promise((resolve)=>{
                const el = document.createElement('span');
                el.style.visibility = 'hidden';
                el.style.position = 'absolute';
                el.style.font = variant + ' 12px ' + this.config.font;
                el.innerText = 'abc';
                document.body.appendChild(el);
                setTimeout(()=>{
                    document.body.removeChild(el);
                    resolve();
                }, this.config?.legacyTimeout || 50);
            });
        })).then(this.onLoad.bind(this));
    }
}


class $027da472f6148770$export$2e2bcd8739ae039 extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager){
        super(pluginManager);
        pluginManager.registerFileType('webfont', $027da472f6148770$var$loaderCallback);
        if (!document.fonts) console.warn('Browser does not support FontFaceSet');
    }
}
// TODO: add support for array of objects as key
const $027da472f6148770$var$loaderCallback = function(key, url, variants, testString, legacyTimeout) {
    this.addFile(new $9f91d4c358402caa$export$2e2bcd8739ae039(this, key, url, variants, testString, legacyTimeout));
    return this;
};


export {$027da472f6148770$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=WebFontPlugin.esm.js.map
