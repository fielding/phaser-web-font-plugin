/// <reference path="../node_modules/phaser/types/phaser.d.ts"/>

interface WebFontFileConfig {
  key: string;
  url?: string;
  variants?: string[];
  testString?: string;
  legacyTimeout?: number;
}

declare module 'phaser' {
  namespace Loader {
    interface LoaderPlugin {
      webfont(key: WebFontFileConfig | string, url?: string, variants?: string[], testString?: string, legacyTimeout?: number): this;
    }
  }
}
