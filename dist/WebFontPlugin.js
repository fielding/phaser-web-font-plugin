function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $799f20e42a07b366$export$2e2bcd8739ae039);
/**
 * @author       Fielding Johnston <fielding@justfielding.com> 
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */ const $298e182bf37d6370$var$IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
const $298e182bf37d6370$var$GetFastValue = Phaser.Utils.Objects.GetFastValue;
class $298e182bf37d6370$export$2e2bcd8739ae039 extends Phaser.Loader.File {
    variantsProcessed = [];
    constructor(loader, key, url, variants, testString, legacyTimeout){
        if ($298e182bf37d6370$var$IsPlainObject(key)) {
            const config = key;
            key = $298e182bf37d6370$var$GetFastValue(config, 'key');
            url = $298e182bf37d6370$var$GetFastValue(config, 'url');
            variants = $298e182bf37d6370$var$GetFastValue(config, 'variants', [
                'normal'
            ]);
            testString = $298e182bf37d6370$var$GetFastValue(config, 'testString');
            legacyTimeout = $298e182bf37d6370$var$GetFastValue(config, 'legacyTimeout');
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


class $799f20e42a07b366$export$2e2bcd8739ae039 extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager){
        super(pluginManager);
        pluginManager.registerFileType('webfont', $799f20e42a07b366$var$loaderCallback);
        if (!document.fonts) console.warn('Browser does not support FontFaceSet');
    }
}
// TODO: add support for array of objects as key
const $799f20e42a07b366$var$loaderCallback = function(key, url, variants, testString, legacyTimeout) {
    this.addFile(new $298e182bf37d6370$export$2e2bcd8739ae039(this, key, url, variants, testString, legacyTimeout));
    return this;
};


//# sourceMappingURL=WebFontPlugin.js.map
