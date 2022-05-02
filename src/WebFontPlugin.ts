/**
 * @author       Fielding Johnston <fielding@justfielding.com> 
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
import WebFontFile from './WebFontFile';

export default class WebFontPlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);

    pluginManager.registerFileType('webfont', loaderCallback);

    if (!document.fonts) {
      console.warn('Browser does not support FontFaceSet');
    }
  }
}

// TODO: add support for array of objects as key
const loaderCallback = function (
  this: Phaser.Loader.LoaderPlugin,
  key: WebFontFileConfig | string,
  url: string,
  variants: string[],
  testString?: string,
  legacyTimeout?: number
) {

  this.addFile(new WebFontFile(this, key, url, variants, testString, legacyTimeout));

  return this;
};
