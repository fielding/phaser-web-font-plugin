/**
 * @author       Fielding Johnston <fielding@justfielding.com> 
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
const GetFastValue = Phaser.Utils.Objects.GetFastValue;


export default class WebFontFile extends Phaser.Loader.File {
  variantsProcessed: string[] = [];

  constructor(loader: Phaser.Loader.LoaderPlugin, key: WebFontFileConfig | string, url?: string, variants?: string[], testString?: string, legacyTimeout?: number) {

    if (IsPlainObject(key as WebFontFileConfig)) {
      const config = key as WebFontFileConfig;

      key = GetFastValue(config, 'key');
      url = GetFastValue(config, 'url');
      variants = GetFastValue(config, 'variants', [ 'normal' ]);
      testString = GetFastValue(config, 'testString');
      legacyTimeout = GetFastValue(config, 'legacyTimeout');
    } else if (variants === undefined) {
      variants = [ 'normal' ];
    }


    const fileConfig = {
      type: 'webfont',
      key,
      url,
      config: {
        variants,
        testString,
        legacyTimeout,
      }
    }

    super(loader, fileConfig as Phaser.Types.Loader.FileConfig);
  }

  load(): this {
    const link = document.createElement('link');
    link.href = this.url as string;
    link.rel = 'stylesheet';
    link.onload = document.fonts ? this.loadFont.bind(this) : this.loadFontLegacy.bind(this);
    
    document.head.appendChild(link);
    return this;
  }

  onLoad() {
    this.loader.nextFile(this, true);
  }

  onVariantProcessed(variant: string) {
    this.variantsProcessed.push(variant);
    if (this.config.variants.length === this.variantsProcessed.length) this.onLoad();
  }

  
  private loadFont() {
    this.config.variants.forEach((variant: string) => {
      document.fonts.load(`${variant} 12px '${this.key}'`, this.config?.testString)
      .then(this.onVariantProcessed.bind(this, variant))
      .catch((err) => {
        console.warn('WebFontPlugin Error: ', err);
        this.onVariantProcessed(variant);
      });
    })
  }

  // Note: not 100% sure this works.. it seemed to with my initial testings though
  private loadFontLegacy() {
    return Promise.all(
      this.config.variants.map((variant: string) => {
        return new Promise<void>((resolve)  => {
          const el = document.createElement('span');
          el.style.visibility = 'hidden';
          el.style.position = 'absolute';
          el.style.font = variant + ' 12px ' + this.config.font;
          el.innerText = 'abc';
          document.body.appendChild(el);

          setTimeout(() => {
            document.body.removeChild(el);
            resolve();
          }, this.config?.legacyTimeout || 50);
        });

      })
    ).then(this.onLoad.bind(this));
  }
}